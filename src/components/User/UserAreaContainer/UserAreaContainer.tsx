import {
	AppBar,
	Divider,
	Drawer,
	IconButton,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Toolbar,
	Typography,
	createStyles,
	Theme,
	WithStyles,
	withStyles
} from "@material-ui/core";
import AppsIcon from "@material-ui/icons/Apps";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import InfoIcon from "@material-ui/icons/Info";
import React from "react";
import { Redirect, Route, RouteComponentProps, Switch, withRouter } from "react-router-dom";
import JWT from "../../../scripts/Cache/JWT";
import BoardOverview from "../BoardOverview/BoardOverview";
import About from "../About/About";
import YarbIcon from "../../YarbIcon/YarbIcon";

interface UserAreaContainerProperties extends RouteComponentProps, WithStyles<typeof styles> {}
interface UserAreaContainerState {}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const styles = (theme: Theme) =>
	createStyles({
		userAreaRoot: {
			display: "block"
		},
		userAreaHorizontalContainer: {
			display: "flex"
		},
		sideNavBar: {
			width: theme.spacing(20)
		},
		leftMenu: {
			top: "unset",
			width: theme.spacing(20)
		},
		userAreaContent: {
			flexGrow: 1,
			padding: theme.spacing(4),
			position: "relative"
		},
		appBarTitle: {
			flexGrow: 1,
			marginLeft: theme.spacing(2)
		}
	});

class UserAreaContainer extends React.Component<UserAreaContainerProperties, UserAreaContainerState> {
	constructor(props: UserAreaContainerProperties) {
		super(props);
		this.handleOnClick = this.handleOnClick.bind(this);
	}

	handleOnClick(): void {
		JWT.getInstance().remove();
		this.props.history.push("/login");
	}

	render(): React.ReactNode {
		return (
			<div className={this.props.classes.userAreaRoot}>
				<AppBar position="static">
					<Toolbar>
						<YarbIcon/>
						<Typography variant="h6" className={this.props.classes.appBarTitle}>
							YARB
						</Typography>
						<IconButton edge="start" color="inherit" aria-label="logout" onClick={this.handleOnClick}>
							<ExitToAppIcon />
						</IconButton>
					</Toolbar>
				</AppBar>
				<div className={this.props.classes.userAreaHorizontalContainer}>
					<Drawer
						className={this.props.classes.sideNavBar}
						variant="permanent"
						anchor="left"
						classes={{
							paper: this.props.classes.leftMenu
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
					<main className={this.props.classes.userAreaContent}>
						<Switch>
							<Route exact path={this.props.match.url + "/boards"} render={() => <BoardOverview />} />
							<Route exact path={this.props.match.url + "/about"} render={() => <About />} />
							<Redirect from={this.props.match.url + "*"} to={this.props.match.url + "/boards"} />
						</Switch>
					</main>
				</div>
			</div>
		);
	}
}

export default withStyles(styles, { withTheme: true })(withRouter(UserAreaContainer));
