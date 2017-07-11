import React, {Component} from 'react';
import { Redirect } from 'react-router';
import {StyleSheet, View, Text, TextInput, Dimensions, TouchableOpacity, Platform} from 'react-native';

import DatePicker from 'react-native-datepicker';
import Select from '../../../components/select/Select';

import update from 'immutability-helper';
import _ from 'lodash';

import moment from 'moment';
import 'moment/locale/pt-br';
moment.locale('pt-BR');

import styles from './styles';

// Services imports
import NeighborhoodService from '../../../services/NeighborhoodService';
import EventService from '../../../services/EventService';

export default class FluxCreateStep1 extends Component {
  state = {
    neighborhoods: [],
    neighborhood: null,
    eventData: {
      nome: null,
      endereco: null,
      bairro_id: null,
      dt_evento: null,
      descricao: null,
    },
    goNextScreen: false,
  }

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.fetchNeighborhoods();
  }

  // Fetches
  fetchNeighborhoods() {
    NeighborhoodService.find()
    .then( ({objects:neighborhoods}) => {
      this.setState({neighborhoods});
    });
  }

  // Handles
  onNeighborhoodSelectHandle(neighborhood) {
    let eventData = update(this.state.eventData, {$merge: {bairro_id:neighborhood.id}});
    this.setState({neighborhood, eventData});
  }

  onChangeDateHandle(date) {
    this.setState({ eventData: update(this.state.eventData, {$merge: {dt_evento:date}}) })
  }

  delayedChangeTextInput(field) {
    return (
      _.debounce(value => {
        let eventData = update(this.state.eventData, {$merge: {[field]:value}});
        this.setState({eventData});
      }, 100)
    );
  }

  next() {
    EventService.data = update(EventService.data, {$merge: this.state.eventData});
    this.setState({goNextScreen: true});
  }

  render() {
    let incompleteFill = Object.keys(this.state.eventData)
    .some(current => this.state.eventData[current] === null || this.state.eventData[current] === '');

    return (
      this.state.goNextScreen ?
      <Redirect to="/flux-create-step-2" /> :
      <View style={styles.container}>
        <View style={styles.page}>
          <TextInput
            placeholder="NOME DO FLUXO"
            style={styles.input}
            defaultValue={this.state.eventData.nome}
            onChangeText={this.delayedChangeTextInput('nome')}
            autoCorrect={false}
            keyboardType="default"
            autoCapitalize="none"
            underlineColorAndroid="transparent">
          </TextInput>
          <TextInput
            placeholder="ONDE SERÁ REALIZADO"
            style={[styles.input, styles.address]}
            defaultValue={this.state.eventData.endereco}
            onChangeText={this.delayedChangeTextInput('endereco')}
            autoCorrect={false}
            multiline={true}
            keyboardType="default"
            autoCapitalize="none"
            underlineColorAndroid="transparent">
          </TextInput>
          <Select
            placeholder="SELECIONE O BAIRRO"
            options={this.state.neighborhoods}
            defaultSelectedId={this.state.eventData.bairro_id}
            onSelect={this.onNeighborhoodSelectHandle.bind(this)}>
          </Select>
          <DatePicker
            style={styles.datePicker}
            date={this.state.eventData.dt_evento}
            mode="date"
            placeholder="DATA"
            locale="pt-br"
            format="DD/MM/YYYY"
            minDate={ moment().format('DD-MM-YYYY') }
            maxDate={ moment().add(1, 'year').calendar() }
            confirmBtnText="Confirmar"
            cancelBtnText="Cancelar"
            customStyles={{
              dateIcon: {
                position: 'absolute',
                right: 4,
                top: 4,
                marginLeft: 0
              },
              dateInput: {
                height: 36,
                padding: 10,
                marginVertical: 2,
                backgroundColor: '#FAFAFA',
                borderWidth: 0,
                alignItems: 'flex-start',
              },
              placeholderText: {
                fontSize: 16,
                color: '#C3C3C3',
              },
              // placeholderTextColor
              dateText: {
                fontSize: 16,
                color: '#616161',
              }
            }}
            onDateChange={(date) => { this.onChangeDateHandle(date) }}
          />
          <TextInput
            placeholder="DESCRIÇÃO: Descreva o encontro ou a ação e lembre-se de detalhar porque você sugere este encontro, do que se trata e quais são os objetivos."
            style={[styles.input, styles.description]}
            defaultValue={this.state.eventData.descricao}
            onChangeText={this.delayedChangeTextInput('descricao')}
            autoCorrect={false}
            multiline={true}
            keyboardType="default"
            autoCapitalize="sentences"
            underlineColorAndroid="transparent">
          </TextInput>
        </View>

        <TouchableOpacity onPress={() => {this.next()}} disabled={incompleteFill}>
          <View style={[styles.btnActionDone, incompleteFill && styles.btnActionDoneDisabled]}>
            <Text style={styles.btnActionDoneText}>CONTINUAR</Text>
          </View>
        </TouchableOpacity>

      </View>
    );
  }
}