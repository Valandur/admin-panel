import * as React from "react"
import { Button, Icon } from "semantic-ui-react"

import { Location } from "../../fetch"

export interface Props {
	location: Location | undefined
}

export default ({ location }: Props) =>
	location ? (
		<Button primary>
			<Icon name="globe" />
			{location.world.name}&nbsp; &nbsp;
			{location.position.x.toFixed(0)} |&nbsp;
			{location.position.y.toFixed(0)} |&nbsp;
			{location.position.z.toFixed(0)}
		</Button>
	) : (
		<Button negative>Invalid location</Button>
	)
