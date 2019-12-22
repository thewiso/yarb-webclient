import { createStyles, Drawer, Theme, Typography, WithStyles, withStyles } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import ErrorIcon from "@material-ui/icons/Error";
import React from "react";
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import { YarbError, YarbErrorHandler } from "../../api/Utils/YarbErrorHandler";
import JWT from "../../scripts/Cache/JWT";
import AuthorizationContainer from "../Authorization/AuthorizationContainer/AuthorizationContainer";
import BoardComponent from "../Board/BoardComponent/BoardComponent";
import RouterFilter from "../RouterFilter/RouterFilter";
import UserAreaContainer from "../User/UserAreaContainer/UserAreaContainer";
import "./App.css";

interface AppProperties extends WithStyles<typeof styles> { }
interface AppState {
	errorDrawerOpen: boolean;
	errorDrawerText: string;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const styles = (theme: Theme) =>
	createStyles({
		errorDrawerContent: {
			minHeight: theme.spacing(20),
			padding: theme.spacing(2)
		},
		errorDrawerTitleContainer: {
			display: "flex",
			alignItems: "center",
			marginBottom: theme.spacing(1),
		},
		errorDrawerTitle: {
			marginLeft: theme.spacing(1),
		}
	});

class App extends React.Component<AppProperties, AppState> {

	constructor(props: AppProperties) {
		super(props);
		this.state = {
			errorDrawerOpen: false,
			errorDrawerText: ""
		};
		YarbErrorHandler.getInstance().addErrorListener(this.handleAxiosError.bind(this));
	}

	handleAxiosError(error: YarbError): void {
		this.setState({
			errorDrawerOpen: true,
			errorDrawerText: error.message
		});
	}

	handleErrorDialogClose(): void {
		this.setState({ errorDrawerOpen: false });
	}

	render(): React.ReactNode {
		//https://medium.com/@anneeb/redirecting-in-react-4de5e517354a
		return (
			<div>
				<CssBaseline />
				<Router>
					<Switch>
						<Route
							exact
							path={["/", "/login"]}
							render={() => (
								<RouterFilter condition={!JWT.getInstance().isPresent()} redirectUrl="/user">
									<AuthorizationContainer />
								</RouterFilter>
							)}
						/>
						<Route
							path="/user"
							render={() => (
								<RouterFilter condition={JWT.getInstance().isPresent()} redirectUrl="/login">
									<UserAreaContainer />} />
								</RouterFilter>
							)}
						/>
						<Route path="/boards/:id" component={BoardComponent} />
						<Redirect from="*" to="/" />
					</Switch>
				</Router>
				<Drawer anchor="bottom" open={this.state.errorDrawerOpen} onClose={this.handleErrorDialogClose.bind(this)}>
					<div className={this.props.classes.errorDrawerContent}>
						<div className={this.props.classes.errorDrawerTitleContainer}>
							<ErrorIcon color="secondary" fontSize="large" />
							<Typography variant="h5" className={this.props.classes.errorDrawerTitle} >
								An error occured
							</Typography>
						</div>
						<Typography>{this.state.errorDrawerText}</Typography>
					</div>
				</Drawer>
			</div>
		);
	}
}

export default withStyles(styles, { withTheme: true })(App);
