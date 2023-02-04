import { Box, ButtonGroup, Divider, Stack, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import { DesktopDatePicker, LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment, { Moment } from 'moment';
import * as React from 'react';
import { useEffect } from 'react';

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
        formsItems: Array<any>(),
        buttonDisabled: {
          add: false,
          remove: true,
          submit: true
        }
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

    generatePairsFormItem = (componentsList : React.ReactElement[], average: number, 
      hours: moment.Moment[], temperatureList: ITemperatureItem[]) : React.ReactElement[] => {
      if (componentsList.length == 0) {
        componentsList.push(
          this.generateSingleFormItem(componentsList.length, {hour: moment(hours[0]), value: average})
        );
        componentsList.push(
          this.generateSingleFormItem(componentsList.length, {hour: moment(hours[1]), value: average})
        );
      }
      else if (componentsList.length == 2) {
        componentsList.push(
          this.generateSingleFormItem(componentsList.length, {hour: moment(hours[0]), value: (temperatureList[0].value+average)/2})
        );
        componentsList.push(
          this.generateSingleFormItem(componentsList.length, {hour: moment(hours[1]), value: (temperatureList[1].value+average)/2})
        );
      }
      return componentsList;
    }

    generatePairsTemperatureItems = (temperatureList : ITemperatureItem[], average: number, 
      hours: moment.Moment[]) : ITemperatureItem[] => {
      if (temperatureList.length == 0) {
        temperatureList.push(
          {hour: moment(hours[0]), value: average}, 
          {hour: moment(hours[1]), value: average}
        );
      }
      else if (temperatureList.length ==2) {
        temperatureList.push(
          {hour: moment(hours[0]), value: ((temperatureList[0].value)+average)/2}, 
          {hour: moment(hours[1]), value: (temperatureList[1].value+average)/2}
        );
      }
      return temperatureList;
    }

    computeAverageTemperature = (temperatureList : ITemperatureItem[]) : number => {
      //Return 0 if there is less than 2 elements else it returns the average of both elements value's
      return ((temperatureList.length < 2) ? 0 : (temperatureList[0].value + temperatureList[1].value) / 2);
    }

    handleAddFormItem = () => {
      //Copy of React Components list
      let componentsList = this.state.formsItems.slice();
      console.log("@------------------");
      console.log("COMPONENTS ORIGINAL LIST: ", componentsList);
      if(componentsList.length >= 4) return;

      //Copy of Temperature Items list
      let temperatureList = this.state.day.temperatures.slice();
      console.log("TEMPERATURES ORIGINAL LIST: ", temperatureList);
      //Compute the average (initial value of new Components and Temperature Items)
      const average : number = this.computeAverageTemperature(temperatureList);
      console.log("AVERAGE: ", average);
      //Generate the right and required pairs of hours to initialize 
      const hours = this.generateCorrectHour(componentsList.length);
      console.log("HOURS PAIR: ", hours);

      componentsList = this.generatePairsFormItem(componentsList, average, hours, temperatureList);
      
      componentsList = this.sortFormList(componentsList);
      console.log("COMPONENTS SORTED LIST: ", componentsList);
      this.setState({day: this.state.day, formsItems: componentsList});
      
      temperatureList = this.generatePairsTemperatureItems(temperatureList, average, hours);
      temperatureList = this.sortTempList(temperatureList);
      console.log("TEMPERATURES SORTED LIST: ", temperatureList);
      console.log("$------------------");
      this.setState({
        day: {
          daynumber: "BLABLA",
          date: this.state.day.date,
          temperatures: temperatureList
        }
      }, () => this.buttonDisabledController());
    }

    handleRemoveFormItem = () => {
      const componentsList = this.state.formsItems.slice();
      if(componentsList.length == 2) { componentsList.splice(0, 2) }
      else if (componentsList.length >= 4) { componentsList.splice(1, 2); }
      this.setState({formsItems: componentsList});

      const temperatureList = this.state.day.temperatures.slice();
      if(temperatureList.length == 2) { temperatureList.splice(0, 2); }
      else if (temperatureList.length >= 4) { temperatureList.splice(1, 2); }
      this.setState({
        day: {
          daynumber: "BLABLA",
          date: this.state.day.date,
          temperatures: temperatureList 
        }
      }, () => this.buttonDisabledController());
    }

    handleChangeDate = (value : Moment | null) => {
      this.setState({
          day : {
            daynumber: "AAA",
            date: moment(value, 'DD/MM/YYYY').startOf('day'),
            temperatures: this.state.day.temperatures
          }
      })
    };

    handleChangeTimeAndValue = (value : number, hour:  moment.Moment, i: number) => {
      const temperatureList = this.state.day.temperatures.slice()
      
      temperatureList[i] = {value: value, hour: moment(hour)};
      this.setState({
        day: {
          daynumber: "BLABLA",
          date: this.state.day.date,
          temperatures: temperatureList
        }
      });
    }

    handleOnClick = () => {
      let temperatureList = this.state.day.temperatures.slice();
      if (temperatureList.length < 2) return;
      if (temperatureList.length == 2) {
        const average : number = this.computeAverageTemperature(temperatureList);
        const hours = this.generateCorrectHour(temperatureList.length);

        temperatureList = this.generatePairsTemperatureItems(temperatureList, average, hours);
        temperatureList = this.sortTempList(temperatureList);
      }
      
      this.props.handleCollectDayData(this.state.day);  
      this.setState({
        day: {
          daynumber: "ORRHh",
          date: this.state.day.date,
          temperatures: []
        }, 
        formsItems: []
      }, () => this.buttonDisabledController())
    }

    buttonDisabledController() : void {
      this.setState({
        buttonDisabled: {
          add: (this.state.formsItems.length > 2),
          remove: (this.state.formsItems.length < 2),
          submit: (this.state.formsItems.length < 2)
        }
      })
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
                <Button color='primary' sx={{fontSize: 24}} onClick={this.handleAddFormItem}
                disabled={this.state.buttonDisabled.add}>+</Button>
                <Button color='error' sx={{fontSize: 24}} onClick={this.handleRemoveFormItem}
                disabled={this.state.buttonDisabled.remove}>-</Button>
              </ButtonGroup>
              <Button variant="contained" color="success" 
              onClick={() => this.handleOnClick()} disabled={this.state.buttonDisabled.submit}
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