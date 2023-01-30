import { Box, ButtonGroup, Divider, Stack, TextField } from '@mui/material';
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

    generateCorrectHour = (len : number) : moment.Moment[] => {
      let hour1 = moment().startOf('day');
      let hour2 = moment().startOf('day');
      switch(len) {
        case 0:
          hour1 = moment(hour1).add(0, 'hours');
          hour2 = moment(hour2).add(23, 'hours').add(59, 'minutes');
          break;
        case 2:
          hour1 = moment(hour1).add(6, 'hours');
          hour2 = moment(hour2).add(18, 'hours');
          break;
      }
      return [hour1, hour2];
    }

    sortFormList = (formList : TemperatureFormItem[]) : TemperatureFormItem[] => {
      console.log(formList);
      return formList.sort((f1,f2) => {
        if (moment(f1.props.item.hour).isAfter(moment(f2.props.item.hour))) {
            return 1;
        } 
        if (moment(f1.props.item.hour).isBefore(moment(f2.props.item.hour))) {
            return -1;
        }
        return 0;
      });
    }

    sortTempList = (tempList : ITemperatureItem[]) : ITemperatureItem[] => {
      console.log(tempList);
      return tempList.sort((t1,t2) => {
        if (moment(t1.hour).isAfter(moment(t2.hour))) {
            return 1;
        } 
        if (moment(t1.hour).isBefore(moment(t2.hour))) {
            return -1;
        }
        return 0;
      });
    }

    generateSingleFormItem = (len : number, item : ITemperatureItem) : React.ReactElement => {
      return (
        <TemperatureFormItem 
          itemId={len} 
          item={{hour: item.hour, value: item.value}}
          handleChangeTimeAndValue={this.handleChangeTimeAndValue}
          key={len}
        />
      )
    }

    handleAddFormItem = () => {
      let list = this.state.formsItems.slice();
      if(list.length >= 4) return;
      console.log(list);

      let temps = this.state.day.temperatures.slice();

      let average : number = 0;
      if (temps.length == 2)  {
        average = (temps[0].value + temps[1].value) / 2;
        console.log("AVERAGE: %d / VALUE 1: %d / VALUE 2: %d", average, temps[0].value, temps[1].value);
      }

      const hours = this.generateCorrectHour(list.length);
      if (list.length == 0) {
        list.push(
          this.generateSingleFormItem(list.length, {hour: moment(hours[0]), value: 0})
        );
        list.push(
          this.generateSingleFormItem(list.length, {hour: moment(hours[1]), value: 0})
        );
      }
      else if (list.length == 2) {
        list.push(
          this.generateSingleFormItem(list.length, {hour: moment(hours[0]), value: (temps[0].value+average)/2})
        );
        list.push(
          this.generateSingleFormItem(list.length, {hour: moment(hours[1]), value: (temps[1].value+average)/2})
        );
      }
      
      list = this.sortFormList(list);
      this.setState({formsItems: list});

      if (temps.length == 0) {
        temps.push(
          {hour: moment(hours[0]), value: 0}, 
          {hour: moment(hours[1]), value: 0}
        );
      }
      else if (temps.length == 2) {
        temps.push(
          {hour: moment(hours[0]), value: ((temps[0].value)+average)/2}, 
          {hour: moment(hours[1]), value: (temps[1].value+average)/2}
        );
      }
      
      temps = this.sortTempList(temps);
      this.setState({
        day: {
          daynumber: "BLABLA",
          date: this.state.day.date,
          temperatures: temps
        }
      });
    }


    handleRemoveFormItem = () => {
      const list = this.state.formsItems.slice();
      if(list.length == 2) {list.splice(0, 1); list.splice(0, 1)}
      else if (list.length >= 4) {list.splice(1, 1); list.splice(1, 1)}
      this.setState({formsItems: list});

      const temps = this.state.day.temperatures.slice();
      if(temps.length == 2) {temps.splice(0, 1); temps.splice(0, 1)}
      else if (temps.length >= 4) {temps.splice(1, 1); temps.splice(1, 1)}
      this.setState({
        day: {temperatures: temps}
      });
    }

    handleChangeDate = (value : Moment | null) => {
      this.setState({
          day : {
            daynumber: "AAA",
            date: moment(value, 'DD/MM/YYYY').startOf('day'),
            temperatures: this.state.day.temperatures
          }
      }, () => { console.log("Date :" + this.state.day.date.toString()); });
    };

    handleChangeTimeAndValue = (value : number, hour:  moment.Moment, i: number) => {
      const list = this.state.day.temperatures.slice()
      console.log("Number : ", {number: value});
      list[i] = {value: value, hour: moment(hour)};
      this.setState({
        day: {
          daynumber: "BLABLA",
          date: this.state.day.date,
          temperatures: list
        }
      }, () => { 
        for(let x = 0; x < this.state.day.temperatures.length; x++) {
          console.log("ID: " + x + 
          " Value: " + this.state.day.temperatures[x].value  +
          " Hour: " + moment(this.state.day.temperatures[x].hour).toString());
        }
      });
    }

    handleOnClick = () => {
      let tempsList = this.state.day.temperatures.slice();
      if (tempsList.length < 2) return;
      if (tempsList.length == 2) {
        let average : number = 0;
        average = (tempsList[0].value + tempsList[1].value) / 2; 
        const hours = this.generateCorrectHour(tempsList.length);
        tempsList.push(
          {hour: moment(hours[0]), value: (tempsList[0].value+average)/2}, 
          {hour: moment(hours[1]), value: (tempsList[1].value+average)/2}
        );   
        tempsList = this.sortTempList(tempsList);
        
      }
      
      this.setState(
      {
        day: {
          daynumber: "BLABLA",
          date: this.state.day.date,
          temperatures: tempsList
        }
      }, 
      () => {
        this.props.handleCollectDayData(this.state.day);  
        this.setState({
          day: {
            temperatures: []
          }, 
          formsItems: []
        })
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
                <Button color='primary' sx={{fontSize: 24}} onClick={this.handleAddFormItem}>+</Button>
                <Button color='error' sx={{fontSize: 24}} onClick={this.handleRemoveFormItem}>-</Button>
              </ButtonGroup>
              <Button variant="contained" color="success" 
              onClick={() => this.handleOnClick()}
              > Envoyer </Button>
            </Stack>
            <Divider sx={{mt: 2}}></Divider>
            <Stack direction="column"  mt={2} ml={8} spacing={2} justifyContent="left" alignItems="left">
              {this.state.formsItems}
            </Stack>
          </Box>
        );
      }
}