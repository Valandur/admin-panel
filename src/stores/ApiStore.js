import request from "request";
import _ from "lodash";

class ApiStore {
	constructor() {
		this.apiUrl = window.apiUrl;
		this.apiKey = "ADMIN";

		this.cachedCatalogValues = {};

		this.get = _.bind(this.call, this, "GET");
		this.post = _.bind(this.call, this, "POST");
		this.put = _.bind(this.call, this, "PUT");
		this.delete = _.bind(this.call, this, "DELETE");
	}

	call(method, path, callback, data) {		
		request({
			url: this.apiUrl + path + (path.indexOf("?") >= 0 ? "&" : "?") + "key=" + this.apiKey,
			method: method,
			json: true,
			body: data,
		}, (err, response, body) => {
			if (err) return window.toastr.error(err);
			if (response.statusCode != 200 && response.statusCode != 201) return window.toastr.error(response.statusMessage);
			if (callback) callback(body);
		});
	}

	getCatalogValues(type, callback) {
		if (this.cachedCatalogValues[type]) {
			return this.cachedCatalogValues[type];
		}

		this.get("/api/registry/org.spongepowered.api." + type, body => {
			this.cachedCatalogValues[type] = body.types;
			callback(body.types);
		});
	}

	getEntities(callback, details) {
		this.get("/api/entity" + (details ? "?details" : ""), body => callback(body.entities));
	}
	getEntity(uuid, callback) {
		this.get("/api/entity/" + uuid, body => callback(body.entity));
	}
	createEntity(entity, callback) {
		this.post("/api/entity/", body => callback(body.ok, body.entity), entity);
	}
	deleteEntity(uuid, callback) {
		this.delete("/api/entity/" + uuid, body => callback());
	}

	getPlayers(callback, details) {
		this.get("/api/player" + (details ? "?details" : ""), body => callback(body.players));
	}
	getPlayer(uuid, callback) {
		this.get("/api/player/" + uuid, body => callback(body.player));
	}
}

export default new ApiStore();
