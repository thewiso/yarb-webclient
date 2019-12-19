import React from "react";
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import AuthorizationContainer from "../Authorization/AuthorizationContainer/AuthorizationContainer";
import RouterFilter from "../RouterFilter/RouterFilter";
import UserAreaContainer from "../User/UserAreaContainer/UserAreaContainer";
import "./App.css";
import CssBaseline from "@material-ui/core/CssBaseline";
import JWT from "../../scripts/Cache/JWT";
import BoardComponent from "../Board/BoardComponent/BoardComponent";
import { Drawer, Typography, Theme, createStyles, WithStyles, withStyles } from "@material-ui/core";
import { YarbError, YarbErrorType, YarbErrorHandler } from "../../api/Utils/YarbErrorHandler";
import ErrorIcon from "@material-ui/icons/Error";

interface AppProperties extends WithStyles<typeof styles> {}
interface AppState {
	errorDrawerOpen: boolean;
	errorDrawerText: string;
}

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
	//TODO: eslint with force return type
	/*TODO: general handling of: 
	-500 (show error id)
	-401 (logout)
	*/

	constructor(props: AppProperties) {
		super(props);
		this.state = {
			errorDrawerOpen: false,
			errorDrawerText: ""
		};
		YarbErrorHandler.getInstance().addErrorListener(this.handleAxiosError.bind(this));
	}

	handleAxiosError(error: YarbError) {
		if (error.type === YarbErrorType.NetworkError || error.type === YarbErrorType.InternalServerError) {
			this.setState({
				errorDrawerOpen: true,
				errorDrawerText: error.message
			});
		}
	}

	handleErrorDialogClose(): void {
		this.setState({ errorDrawerOpen: false });
	}

	//TODO: dialog close on esc (see material ui docs!)
	//TODO: replace css with useStyle
	render() {
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
							<ErrorIcon color="secondary" fontSize="large"/>
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
