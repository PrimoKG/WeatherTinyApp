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
    days.push(day);
    console.log("DATE OF PUSHED DAY: ", day.date.toString());
    this.setState({
      days: days
    });
  }

  render () {
    return (
      <Box>
        <ChartController days= {this.state.days}/>
        <TemperatureForm  handleCollectDayData= {this.handleCollectDayData} />
        <button onClick={() => alert("JE LAI PAS DEFINI")}> Afficher dernière </button>
      </Box>
    );
  }
}