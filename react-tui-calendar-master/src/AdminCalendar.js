// React
import React, { useState, useEffect, createRef } from 'react';
import './App.css';


// Tui Calendar
import Calendar from '@toast-ui/react-calendar'
import 'tui-calendar/dist/tui-calendar.css'
import 'tui-date-picker/dist/tui-date-picker.css'
import 'tui-time-picker/dist/tui-time-picker.css'

import myTheme from './theme';

// Material Ui
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import { withStyles } from '@material-ui/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';



//Axios
const axios = require('axios').default;


export default function CalendarComponent() {
    //Sample schedule
    const [newScheduleList, setNewScheduleList] = useState([])
    const [scheduleList, setSchedule] = useState([])
    const [loading, setLoading] = useState(false);

    //Custom theme for the calendar
    const customTheme = { myTheme }

    const calendarRef = createRef()

    //Preview and Next function for the calendar
    const handlePrevButton = () => {
        const calendarInstance = calendarRef.current.getInstance()
        calendarInstance.prev()
    }

    const handleNextButton = () => {
        const calendarInstance = calendarRef.current.getInstance()
        calendarInstance.next()
    }

    // Today function
    const handleTodayButton = () => {
        const calendarInstance = calendarRef.current.getInstance()
        calendarInstance.today()
    }

    //Calendar schedule categories
    const calendarCat = [
        {
            id: '0',
            name: 'Conferencia',
            bgColor: '#9e5fff',
            borderColor: '#9e5fff'
        },
        {
            id: '1',
            name: 'Taller',
            bgColor: '#00a9ff',
            borderColor: '#00a9ff'
        },
        {
            id: '2',
            name: 'Otro',
            bgColor: '#03bd9e',
            borderColor: '#03bd9e'
        }
    ]

    //New schedule popup
    const handleNewSchedule = event => {
        const calendarInstance = calendarRef.current.getInstance()
        calendarInstance.openCreationPopup(event.schedule)
    }

    //Create new schedule
    const handleCreateSchedule = event => {
        let url = " https://us-central1-agendandoando-c068f.cloudfunctions.net/postSchedule";
        let copySchedule = newScheduleList

        console.log(event);

        const start = event.start._date;
        const end = event.end._date;

        let newSchedule = {
            id: Date.now(),
            calendarId: event.calendarId,
            title: event.title,
            category: 'time',
            start: start,
            end: end,
            location: event.location,
            participants: 0
        }

        axios.post(url, newSchedule)
            .then(() => {
                console.log("Post succeful");
            })
            .catch(e => {
                console.log(e);
            })

        copySchedule.push(newSchedule)
        setNewScheduleList([...copySchedule])
        console.log(copySchedule, scheduleList);
    }

    //Edit schedule
    const handleUpdateSchedule = event => {
        const updatedId = event.schedule.id
        let copySchedule = newScheduleList
        let updateSchedule

        copySchedule.forEach((item, index) => {
            if (item.id === updatedId) {
                updateSchedule = {
                    id: event.schedule.id,
                    calendarId: event.schedule.calendarId,
                    title: event.schedule.title,
                    category: 'time',
                    start: event.start,
                    end: event.end,
                }

                copySchedule[index] = updateSchedule
            }
        })

        setNewScheduleList([...copySchedule])
    }

    //Delete schedule
    const handleDeleteSchedule = event => {
        const deleteId = event.schedule.id
        let copySchedule = newScheduleList

        copySchedule.forEach((item, index) => {
            if (item.id === deleteId) {
                copySchedule.splice(index, 1)
            }
        })

        setNewScheduleList([...copySchedule])
    }

    const fetchData = async () => {
        return await axios.get(urlGet)
            .then(res => {
                console.log(res.data)
                return res.data
            })
            .catch(e => {
                return e;
            })
        console.log(scheduleList)
    };

    let urlGet = "https://us-central1-agendandoando-c068f.cloudfunctions.net/getSchedule";

    //Set current Schedule
    useEffect(() => {
        setSchedule(newScheduleList)
    }, [scheduleList, newScheduleList])


    // Custom schedule popup template
    const schedPopupTemplate = {
        titlePlaceholder: () => {
            return 'Subject'
        },
        alldayTitle: () => {
            return '<span class="tui-full-calendar-left-content" style="color: #fff">All Day</span>'
        },
        popupStateFree: () => {
            return '50'
        },
        popupStateBusy: () => {
            return '100'
        }
    }

    //Set calendar features/options
    const calendarOptions = {
        usageStatistics: false,
        theme: customTheme,
        taskView: false,
        scheduleView: true,
        view: "week",
        disableDblClick: false,
        disableClick: true,
        useDetailPopup: true,
        useCreationPopup: true,
        schedules: scheduleList,
        template: schedPopupTemplate,
        calendars: calendarCat,
        onBeforeCreateSchedule: handleCreateSchedule,
        onBeforeUpdateSchedule: handleUpdateSchedule,
        onBeforeDeleteSchedule: handleDeleteSchedule,
        week: {
            showTimezoneCollapseButton: true,
            timezonesCollapsed: false,
            hourStart: 7,
            hourEnd: 18
        }
    }

    return (
        <div>
            <Container>
                <Paper elevation="20">

                    <Typography variant="h1" component="h2">agendandoAndo</Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={4}>
                            <Table aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center" component="th" scope="row">
                                            Detalles del evento
                            </TableCell>
                                        <TableCell align="center" component="th" scope="row">
                                            INCMty
                            </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell component="th" scope="row">
                                            Lugar
                            </TableCell>
                                        <TableCell align="right">Tec de Monterrey</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="th" scope="row">
                                            Salas disponibles
                            </TableCell>
                                        <TableCell align="right">10</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="th" scope="row">
                                            Numero de participantes
                            </TableCell>
                                        <TableCell align="right">180</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Grid>
                        <Grid item xs={8}>
                            <Card>
                                <div>
                                    <button className="btn btn-default btn-sm move-day" onClick={handlePrevButton}>Prev</button>
                                    <button className="btn btn-default btn-sm move-day" onClick={handleNextButton}>Next</button>
                                </div>
                                <div>
                                    <button className="btn btn-default btn-sm move-today" onClick={handleTodayButton}>Today</button>
                                </div>
                                <Calendar
                                    ref={calendarRef}
                                    {...calendarOptions}
                                />
                            </Card>
                        </Grid>
                    </Grid>
                </Paper>

            </Container>
        </div>
    );
}