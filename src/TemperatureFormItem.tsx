import { ButtonGroup, Stack, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import { DesktopDatePicker, LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment, { Moment } from 'moment';
import * as React from 'react';

import { ITemperatureItem } from './Container';

interface TempFormProps {
    handleChangeTimeAndValue : (value : number, hour:  moment.Moment, i: number) => void,
    item: ITemperatureItem,
    itemId: number
}

interface IState {
    item: ITemperatureItem,
}
export default class TemperatureForm extends React.Component<TempFormProps, IState> {

    state = {
        item: {hour: moment().startOf('day'), value: this.props.item.value}
    };

    handleChangeValue = (event : any) => {
      this.setState({
          item : {value: (event.target.value), hour: this.state.item.hour}
      }, () => { this.props.handleChangeTimeAndValue(
        this.state.item.value, 
        this.state.item.hour,
        this.props.itemId
        )});
    };

    handleChangeHour = (hour : number | null) => {
      this.setState({
        item : {value: this.state.item.value, hour: moment(hour)}
      }, () => { this.props.handleChangeTimeAndValue(
        this.state.item.value, 
        this.state.item.hour,
        this.props.itemId
        ) });
    }

    currentValueToDisplay = () => {
      return (this.state.item.hour);
    }

    render() {
        return (
          <Stack direction="row" ml={8} spacing={2}>
            <LocalizationProvider dateAdapter={AdapterMoment}>       
            <TimePicker
              label="Time"
              value={this.currentValueToDisplay()}
              onChange={this.handleChangeHour}
              renderInput={(params) => <TextField {...params} />}
              views={['hours']}
              ampm={false}
            />
            </LocalizationProvider>

            <TextField name="temperatureInput" type="number" label="Temperature"
              value={this.state.item.value} onChange={this.handleChangeValue} />
          
          </Stack>
        );
      }
}