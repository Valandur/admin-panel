import * as React from 'react';
import { Icon, Label } from 'semantic-ui-react';

import { Location } from '../../fetch';

export interface Props {
	location: Location | undefined;
}

export default ({ location }: Props) =>
	location ? (
		<Label color="blue">
			<Icon name="globe" />
			{location.world.name}&nbsp; &nbsp;
			{location.position.x.toFixed(0)} |&nbsp;
			{location.position.y.toFixed(0)} |&nbsp;
			{location.position.z.toFixed(0)}
		</Label>
	) : (
		<Label color="red">Invalid location</Label>
	);
