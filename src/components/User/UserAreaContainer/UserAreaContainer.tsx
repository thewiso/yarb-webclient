import { AppBar, Divider, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography } from "@material-ui/core";
import AppsIcon from "@material-ui/icons/Apps";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import InfoIcon from "@material-ui/icons/Info";
import React from "react";
import { Redirect, Route, RouteComponentProps, Switch, withRouter } from "react-router-dom";
import JWT from "../../../scripts/Cache/JWT";
import BoardOverview from "../BoardOverview/BoardOverview";
import "./UserAreaContainer.css";

interface UserAreaContainerProperties extends RouteComponentProps {}
interface UserAreaContainerState {}

class UserAreaContainer extends React.Component<UserAreaContainerProperties, UserAreaContainerState> {
	constructor(props: UserAreaContainerProperties) {
		super(props);
		this.handleOnClick = this.handleOnClick.bind(this);
	}

	handleOnClick(): void {
		JWT.getInstance().remove();
		this.props.history.push("/login");
	}

	render() {
		return (
			<div className="userAreaRoot">
				<AppBar position="static">
					<Toolbar>
						<Typography variant="h6" className="appBarTitle">
							YARB
						</Typography>
						<IconButton edge="start" color="inherit" aria-label="logout" onClick={this.handleOnClick}>
							<ExitToAppIcon />
						</IconButton>
					</Toolbar>
				</AppBar>
				<div className="userAreaHorizontalContainer">
					<Drawer
						className="sideNavBar"
						variant="permanent"
						anchor="left"
						classes={{
							paper: "leftMenu"
						}}
					>
						<List>
							<ListItem
								button
								selected={this.props.location.pathname.endsWith("/boards")}
								onClick={() => this.props.history.push(this.props.match.url + "/boards")}
							>
								<ListItemIcon>
									<AppsIcon />
								</ListItemIcon>
								<ListItemText primary="Boards" />
							</ListItem>
						</List>
						<Divider />
						<List>
							<ListItem
								button
								selected={this.props.location.pathname.endsWith("/about")}
								onClick={() => this.props.history.push(this.props.match.url + "/about")}
							>
								<ListItemIcon>
									<InfoIcon />
								</ListItemIcon>
								<ListItemText primary="About" />
							</ListItem>
						</List>
					</Drawer>
					<main className="userAreaContent">
						<Switch>
							{/*TODO: ugly:*/}
							<Route exact path={this.props.match.url + "/boards"} render={() => <BoardOverview />} />
							<Route exact path={this.props.match.url + "/about"} render={() => <div>ABOUT</div>} />
							<Redirect from={this.props.match.url + "*"} to={this.props.match.url + "/boards"} />
						</Switch>
					</main>
				</div>
			</div>
		);
	}
}

export default withRouter(UserAreaContainer);
