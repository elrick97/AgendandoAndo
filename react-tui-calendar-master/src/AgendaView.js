import React, { useState, useEffect, Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { CardActions } from '@material-ui/core';
import { withStyles } from "@material-ui/core/styles";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Paper from '@material-ui/core/Paper';
import './App.css';

const axios = require('axios').default;

const styles = makeStyles(theme => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
    chip: {
        marginRight: theme.spacing(1),
    },
    section1: {
        margin: theme.spacing(3, 2),
    },
    section2: {
        margin: theme.spacing(2),
    },
    section3: {
        margin: theme.spacing(3, 1, 1),
    }
}));

class Agenda extends Component {
    constructor(props) {
        super(props);
        this.state = {
            schedule: null,
            loaded: false
        }
    }

    async fetchData() {
        const x = await axios.get("https://us-central1-agendandoando-c068f.cloudfunctions.net/getSchedule")
            .then(snap => {
                console.log(snap)
                this.setState({
                    schedule: snap.data,
                    loaded: true
                });
            })
            .catch(e => {
                console.log(e);
            });
    }

    componentDidMount() {
        this.fetchData();
    }

    handleButtonClick = (e) => {
        console.log(e);
    }


    makeEvent = (e) => {
        const { classes } = this.props;
        return (
            e.map(e => {
                return (
                    <div>
                        <Card className={classes.card} style={{ backgroundColor: "#9e5fff" }}>
                            <CardContent>
                                <Typography className={classes.title} color="textSecondary" gutterBottom>
                                    {e.location}
                                </Typography>
                                <Typography name="title" variant="h5" component="h2">
                                    {e.title}
                                    <div align="right">
                                        {e.start.split('T')[1].split('.0')[0]}
                                        <br />
                                        <Button onClick={() => this.handleButtonClick(e.title)} variant="outlined">Quiero Asistir</Button>
                                    </div>
                                </Typography>
                            </CardContent>
                        </Card>
                        <br />
                    </div>
                )
            })
        )
    }

    makeContent = () => {
        const { schedule } = this.state;
        // this gives an object with dates as keys
        const groups = schedule.reduce((groups, event) => {
            console.log(event)
            const date = event.start.split('T')[0];
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(event);
            return groups;
        }, {});

        //  add it in the array format instead
        const groupArrays = Object.keys(groups).map((date) => {
            return {
                date,
                events: groups[date]
            };
        });

        groupArrays.sort(function (a, b) {
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(a.date) - new Date(b.date);
        });

        console.log(groupArrays);
        const x = groupArrays.map(element => {
            return (
                <div>
                    <Paper elevation="20">
                        <Typography gutterBottom variant="h2">
                            {element.date}
                        </Typography>
                        {this.makeEvent(element.events)}
                    </Paper>
                    <br />
                    <br />
                </div >

            );
        })
        return x;
    }

    render() {
        const { classes } = this.props;

        if (!this.state.loaded) {
            return (
                <div>Loading...</div>
            )
        } else {
            return (
                <Container>
                    <div>
                        <Typography variant="h3" component="h2">
                            Intinerario INCMty
                        </Typography>
                        <Typography align="right" variant="h5" component="h2">
                            powered by agendandoAndo
                        </Typography>
                        <br />
                        <div className={classes.section1}>
                            {this.makeContent()}
                        </div>
                    </div>
                </Container>
            );
        }
    }
}
export default withStyles(styles)(Agenda);
