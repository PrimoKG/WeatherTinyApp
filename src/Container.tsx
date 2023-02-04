import { Stack } from '@mui/material';
import Box from '@mui/material/Box';
import moment from 'moment';
import * as React from 'react';
import ChartController from './ChartController';
import TempFormProps from './TemperatureForm';
import TemperatureForm from './TemperatureForm';

export interface ITemperatureItem {
  hour: moment.Moment,
  value: number
}

export interface IDay {
  date: moment.Moment,
  temperatures: ITemperatureItem[]
}


export default class Container extends React.Component {
  state = {
    days: Array<IDay>()
  }

  handleCollectDayData = (day: IDay) => {
    const days = this.state.days.slice();
    
    if(this.dayExist(day) > -1) days[this.dayExist(day)].temperatures = day.temperatures;
    else days.push(day);

    console.log("DATE OF PUSHED DAY: ", day.date.toString());
    this.setState({
      days: days
    });
  }

  dayExist(day: IDay) : number {
    const foundDay = this.state.days.slice()
    .find(
      d => moment(d.date).isSame(moment(day.date), 'day')
    );
    if (foundDay == undefined) return -1;
    return (this.state.days.slice().indexOf(foundDay));
  }


  render () {
    return (
      <Box>
        <Stack direction={'row'}>
          <ChartController days= {this.state.days}/>
          <Stack direction={'column'}> 
            <h3>Meteo graph based on dates and values (enter these).</h3>
            <h3>-First choose the date with the date picker.</h3>
            <h3>-Now click on the "+" button to add 2 mores input fields.</h3>
            <h3>-You can remove 2 inputs fields on clicking "-" button.</h3>
            <h3>Submit your data to display it the graph (need at least 2 values' fields to submit).</h3>
          </Stack>
        </Stack>
        
        <TemperatureForm  handleCollectDayData= {this.handleCollectDayData} />
      </Box>
    );
  }
}