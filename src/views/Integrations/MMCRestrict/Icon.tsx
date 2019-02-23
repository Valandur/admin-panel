import * as React from 'react';
import { Icon } from 'semantic-ui-react';

interface Props {
	ban: boolean;
}

export default ({ ban }: Props) => (
	<Icon color={ban ? 'red' : 'green'} name={ban ? 'ban' : 'check'} />
);
