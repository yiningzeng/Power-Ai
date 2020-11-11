import React from "react";
import { withStyles } from "@material-ui/core/styles";
import FormGroup from "@material-ui/core/FormGroup";
import Switch from "@material-ui/core/Switch";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

const PurpleSwitch = withStyles({
    switchBase: {
        "color": "#9400D3",
        "&$checked": {
            color: "#9400D3",
        },
        "&$checked + $track": {
            backgroundColor: "#101010",
        },
    },
    checked: {},
    track: {},
})(Switch);

export interface ISwitchProps {
    leftText: string;
    rightText: string;
    onChange: (checked: boolean) => void;
}

export interface ISwitchState {
    checked: boolean;
}

export class DoubleTextSwitch extends React.Component<ISwitchProps, ISwitchState>  {

    constructor(props) {
        super(props);
        this.state = {
            checked: false,
        };
        this.handleChange = this.handleChange.bind(this);
    }

    public render() {
        return (
            <FormGroup>
                <Typography component="div">
                    <Grid component="label" container justify="center" alignItems="center" spacing={1}>
                        <Grid item>{this.props.leftText}</Grid>
                        <Grid item>
                            <PurpleSwitch checked={this.state.checked} onChange={this.handleChange} name="checkedA"/>
                        </Grid>
                        <Grid item>{this.props.rightText}</Grid>
                    </Grid>
                </Typography>
            </FormGroup>
        );
    }

    /**
     * Close Cloud File Picker
     */
    public handleChange(e): void {
        this.setState({
            ...this.state,
            checked: e.target.checked,
        });
        this.props.onChange(e.target.checked);
    }
}
