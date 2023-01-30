import { ButtonGroup, Stack, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import { DesktopDatePicker, LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment, { Moment } from 'moment';
import * as React from 'react';
import { ChangeEvent } from 'react';

import { ITemperatureItem } from './Container';

interface TempFormProps {
    handleChangeTimeAndValue : (value : number, hour:  moment.Moment, i: number) => void,
    item: ITemperatureItem,
    itemId: number
}

interface IState {
    item: ITemperatureItem,
}
export default class TemperatureFormItem extends React.Component<TempFormProps, IState> {

    state = {
        item: {hour: this.props.item.hour, value: this.props.item.value}
    };

    handleChangeValue = (event : ChangeEvent<HTMLInputElement>) => {
      let num : any = 0;
      if (Number.isNaN(event.target.valueAsNumber)) num = '';
      else num = event.target.valueAsNumber;
      
      this.setState({
          item : {value: num, hour: this.state.item.hour}
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
          <Stack direction="row" spacing={2}>
            <LocalizationProvider dateAdapter={AdapterMoment}>       
            <TimePicker
              label="Time"
              value={this.currentValueToDisplay()}
              onChange={this.handleChangeHour}
              renderInput={(params) => <TextField {...params} />}
              views={['hours']}
              ampm={false}
              readOnly={true}
            />
            </LocalizationProvider>

            <TextField name="temperatureInput" type="number" label="Temperature"
              value={this.state.item.value} onChange={this.handleChangeValue} />
          
          </Stack>
        );
      }
}