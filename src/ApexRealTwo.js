import React from 'react';
import ReactApexChart from 'react-apexcharts';
import ApexCharts from 'apexcharts';
import moment from 'moment';

  var lastDate = 0;
  var data = []
  var series = [{'data':[]},{'data':[]}]
  var labels = []
  // var TICKINTERVAL = 86400000
  var TICKINTERVAL = 1000
  let XAXISRANGE = 60000
  function getDayWiseTimeSeries(baseval, count, yrange) {
      var i = 0;
      while (i < count) {
          var x = new Date(baseval).toLocaleTimeString();
          var y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

          series[0].data.push({
              x, y
          });
          
	  var y2 = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

          series[1].data.push({
              x, y2
          });
          lastDate = baseval
          baseval += TICKINTERVAL;
          i++;
	  if (i%6)
	      labels.push(x);
      }
  }

  getDayWiseTimeSeries(new Date('09/23/2019 22:44:00').getTime(), 60, {
      min: 10,
      max: 90
  })

  function getNewSeries(baseval, yrange) {
      var newDate = baseval + TICKINTERVAL;
      lastDate = newDate
      for( var j = 0; j <2 ; j++){
      //for(var i = 0; i< series[j].data.length - 60; i++) {
          // IMPORTANT
          // we reset the x and y of the data which is out of drawing area
          // to prevent memory leaks
          //series[j].data[i].x = newDate - XAXISRANGE - TICKINTERVAL
          //series[j].data[i].y = 0
	  series[j].data = series[j].data.slice(series[j].data.length -60, series[j].data.length)
      //}
      
      series[j].data.push({
          x: new Date(newDate).toLocaleTimeString(),
          y: Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min
      })
     }
      
  }

  function resetData(){
      // Alternatively, you can also reset the data at certain intervals to prevent creating a huge series 
      data = data.slice(data.length - 10, data.length);
  }

  class ApexRealTwo extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
      options: {
        chart: {
            id: 'realtime2',
            animations: {
              enabled: true,
              easing: 'linear',
              dynamicAnimation: {
                speed: 1000
              }
            },
            toolbar: {
              show: false
            },
            zoom: {
              enabled: false
            }
          },

          dataLabels: {
            enabled: false 
          },
          stroke: {
            curve: 'smooth'
          },
          title: {
            text: 'Dynamic Updating Chart',
            align: 'left'
          },
          markers: {
            size: 0
          },
          xaxis: {
            type: 'categories',
	    labels: {
		    show: true,
		    rotateAlways: true,
		    rotate: -15,
		    formatter: function (value) {
      			if (value.split(" ")[0].split(':')[2]%10 ==1)
			    return value;
			else return "";
    		    },
		    minHeight: 100,
		    maxHeight: 150
	    }
          },
          yaxis: {
            max: 100
          },
          legend: {
            show: false
          },
          tooltip: {
            theme: 'dark',
	    X: {
      		formatter: function (val) {
        		return moment(new Date(val)).format("HH:mm:ss")
      		}
    	    }	
          }
      },
      series: [
	      {data: series[0].data.slice()},
	      {data: series[1].data.slice()}
      ],
    }
  }
  
  componentDidMount() {
    this.intervals()
  }

  intervals () {
    window.setInterval(() => {
      getNewSeries(lastDate, {
        min: 10,
        max: 90
      })
      
      ApexCharts.exec('realtime2', 'updateSeries',series)
    }, 1000)
  }

  render() {

    return (
      
        <div id="chart2">
          <ReactApexChart options={this.state.options} series={this.state.series} type="line" height="350" />
        </div>

    );
  }

}

export default ApexRealTwo;
