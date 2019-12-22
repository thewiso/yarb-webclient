import React from "react";
import { Typography } from "@material-ui/core";
import JWT from "../../../scripts/Cache/JWT";
import YarbApi from "../../../api/yarb/yarb-api";
import { YarbErrorHandler } from "../../../api/Utils/YarbErrorHandler";

interface AboutProperties {}
interface AboutState {
	userName?: string;
}

class About extends React.Component<AboutProperties, AboutState> {
	constructor(props: AboutProperties) {
		super(props);
		this.state = {
			userName: undefined
		};
	}
	private loadUser(): void {
		new YarbApi()
			.getUser()
			.then(response => {
				this.setState({ userName: response.data.username });
			})
			.catch(error => {
				YarbErrorHandler.getInstance().handleUnexpectedError(error);
			});
	}

	componentDidMount(): void {
		this.loadUser();
	}

	private getJWTExpirationFormattedDate(): string {
		const expirationDate = JWT.getInstance().getExpirationDate();
		if (expirationDate) {
			return `${expirationDate.getHours()}:${expirationDate.getMinutes()}:${expirationDate.getSeconds()}`;
		} else {
			return "COULD NOT OBTAIN DATE";
		}
	}

	render(): React.ReactNode {
		if (this.state.userName) {
			return (
				<div>
					<Typography variant="h4">About</Typography>
					<Typography>
						Hey {this.state.userName}, your JWT expires at {this.getJWTExpirationFormattedDate()}
					</Typography>
				</div>
			);
		} else {
			return <div></div>;
		}
	}
}
export default About;
