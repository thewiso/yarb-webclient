import { createStyles, Theme, WithStyles, withStyles } from "@material-ui/core";
import React from "react";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const styles = (theme: Theme) =>
	createStyles({
		yarbIcon: {
			width: theme.spacing(5),
			height: theme.spacing(5)
		}
	});

interface YarbIconProperties extends WithStyles<typeof styles> {}
interface YarbIconState {}

class YarbIcon extends React.Component<YarbIconProperties, YarbIconState> {
	render(): React.ReactNode {
		return <img src="/icons/icon.svg" alt="" className={this.props.classes.yarbIcon} />;
	}
}

export default withStyles(styles, { withTheme: true })(YarbIcon);
