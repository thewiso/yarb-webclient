import React from "react";
import { Redirect } from "react-router";

interface RouterFilterProperties {
	condition: boolean,
	redirectUrl: string;
}
interface RouterFilterState {}

class RouterFilter extends React.Component<RouterFilterProperties, RouterFilterState> {
	render(): React.ReactNode {
		if (this.props.condition) {
			return this.props.children;
		} else {
			return <Redirect to={this.props.redirectUrl} />;
		}
	}
}

export default RouterFilter;
