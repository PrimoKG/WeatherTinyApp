import moment from "moment";
import React from "react";
import { useEffect } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import { isVariableDeclarationList } from "typescript";
import { IDay, ITemperatureItem } from "./Container";

interface Props {
    days: IDay[]
}

interface State {
    days: IDay[],
    curvesItem: Array<any>,
    data: Array<Item>
}

//Une temperature représente la valeur de la temperature
//Pour un jour distinct mais à la même heure

interface dataSingleItem {
    hour: string,
    value: number
}

interface Item {
    day: string,
    data: dataSingleItem[]
}

export default class ChartController extends React.Component<Props, State> {

    state : State = {
        days: this.props.days,
        curvesItem: Array<any>(),
        data: Array<Item>()
    };

    hourExist = (hour: moment.Moment) => {
        const daysCopy = this.state.days.slice();
        let exist = false;
        daysCopy.forEach(day => {
            day.temperatures.forEach(item => {
                if (item.hour == hour) exist = true;
            })
        });
        return exist;
    }

    fillCurves() : void {
        const curvesList : any[] = Array<any>();
        
        let letters = "0123456789ABCDEF";
        
        this.state.data.forEach(dayItem => {
            let color = '#';
            for (let i = 0; i < 6; i++)
            color += letters[(Math.floor(Math.random() * 16))];

            curvesList.push(
                <Line
                    type="monotone"
                    dataKey="value"
                    data={dayItem.data}
                    name={dayItem.day} 
                    key={dayItem.day}
                    stroke={color}
                    activeDot={{ r: 8 }}
                />
            );
        })
        this.setState({curvesItem: curvesList});   
    }
    
    fillDataSet() : void {
        const daysCopy = this.state.days.slice();
        console.log("DAYSCOPY:"); console.log(daysCopy);

        const dataList : Item[] = Array<Item>();
        
        
        for(let i = 0; i < daysCopy.length; i++) {
            
            const tempStock = Array<dataSingleItem>();
                   
            daysCopy[i].temperatures.forEach(tempItem => {
                tempStock.push({hour: moment(tempItem.hour).format('HH:mm'), value: tempItem.value});
            });
            dataList.push({day: moment(daysCopy[i].date).format("DD/MM"), data: tempStock});         
        }
        this.setState({data: dataList}, () => {
            console.log("DATASET:"); console.log(this.state.data);
            this.fillCurves();
        }); 
    }

    fillData() : void { 
        this.setState({
            days: this.props.days
        }, () => {
            console.log("STATE:"); console.log(this.state.days);      
            this.fillDataSet();
        })   
    }

    componentDidUpdate() {
        if (this.state.days != this.props.days) {
            this.fillData();
        }     
    }

    render() {
        
        return (
            <div>
                <LineChart
                    width={600}
                    height={400}
                    data={this.state.data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" allowDuplicatedCategory={false} />
                    <YAxis dataKey="value"/>
                    <Tooltip />
                    <Legend />
                    
                    {this.state.curvesItem}
                    
                </LineChart>
            </div>
        );
    }
}
