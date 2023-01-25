import { Box, ButtonGroup, Stack, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import { DesktopDatePicker, LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment, { Moment } from 'moment';
import * as React from 'react';

import { IDay, ITemperatureItem } from './Container';
import TemperatureFormItem from './TemperatureFormItem';

interface Props {
  handleCollectDayData: (day: IDay) => void
}

export default class TemperatureForm extends React.Component<Props> {

    state = {
        day: {
          daynumber: "AAA",
          date: moment(), 
          temperatures: Array<ITemperatureItem>()
        },
        formsItems: Array<any>()
    };

    handleAddFormItem = () => {
      const list = this.state.formsItems.slice();
      list.push(
      <TemperatureFormItem 
        itemId={list.length} 
        item={{hour: moment().startOf('day'), value: 0}}
        handleChangeTimeAndValue={this.handleChangeTimeAndValue}
        key={list.length}
      />
      );
      this.setState({formsItems: list});

      const temps = this.state.day.temperatures.slice();
      temps.push({hour: moment().startOf('day'), value: 0});
      this.setState({
        day: {temperatures: temps}
      });
    }

    handleRemoveFormItem = () => {
      const list = this.state.formsItems.slice();
      list.pop();
      this.setState({formsItems: list});

      const temps = this.state.day.temperatures.slice();
      temps.pop();
      this.setState({
        day: {temperatures: temps}
      });
    }

    handleChangeDate = (value : Moment | null) => {
      this.setState({
          day : {
            daynumber: "AAA",
            date: moment(value, 'DD/MM/YYYY').startOf('day'),
            temperatures: Array<ITemperatureItem>()
          }
      }, () => { console.log("Date :" + this.state.day.date.toString()); });
    };

    handleChangeTimeAndValue = (value : number, hour:  moment.Moment, i: number) => {
      const list = this.state.day.temperatures.slice()
      list[i] = {value: value, hour: moment(hour)};
      this.setState({
        day: {temperatures: list}
      }, () => { 
        for(let x = 0; x < this.state.day.temperatures.length; x++) {
          console.log("ID: " + x + 
          " Value: " + this.state.day.temperatures[x].value  +
          " Hour: " + moment(this.state.day.temperatures[x].hour).toString());
        }
       });
    }

    render() {
        return (
          <Box>
            <Stack direction="row" ml={8} spacing={2}>
              <LocalizationProvider dateAdapter={AdapterMoment}>
              <DesktopDatePicker
                label="Date"
                inputFormat="DD/MM/YYYY"
                value={this.state.day.date}
                onChange={this.handleChangeDate}
                renderInput={(params) => <TextField {...params} />}
              />
              </LocalizationProvider>
    
              <ButtonGroup variant="contained">
                <Button color='primary' sx={{fontSize: 32}} onClick={this.handleAddFormItem}>+</Button>
                <Button color='error' sx={{fontSize: 32}} onClick={this.handleRemoveFormItem}>-</Button>
              </ButtonGroup>
              <Button variant="contained" color="success" 
              onClick={() => this.props.handleCollectDayData(this.state.day)}
              > Envoyer </Button>
            </Stack>
            <Stack direction="column" ml={8} spacing={2}>
              {this.state.formsItems}
            </Stack>
          </Box>
        );
      }
}