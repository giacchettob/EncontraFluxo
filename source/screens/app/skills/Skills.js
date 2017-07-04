import React, { Component } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  Dimensions
} from 'react-native';

import update from 'immutability-helper';

import ModalDropdown from 'react-native-modal-dropdown';
import Icon from 'react-native-vector-icons/Entypo';

import Select from '../../../components/select/Select';

import TouchableRedirectorWrapper from '../../../components/touchable-redirector-wrapper/TouchableRedirectorWrapper';

import NeighborhoodService from '../../../services/NeighborhoodService';
import SkillsService from '../../../services/SkillsService';
import UserService from '../../../services/UserService';


export default class Skills extends Component {
  state = {
    skills: [],
    userSkills: [],

    neighborhoods: [],
    neighborhood: null,
  }

  componentWillMount() {
    this.fetchNeighborhoods();
    this.fetchSkills();

    var immediateID = setImmediate(() => {
      clearImmediate(immediateID);
      // Authenticated services calls goes here
      this.fetchUserProfile();
    });
  }
  // FETCHES
  fetchNeighborhoods() {
    NeighborhoodService.find()
    .then(response => {
      let neighborhoods = response.objects;
      this.setState({neighborhoods});
    });
  }

  fetchSkills() {
    SkillsService.find()
    .then(response => {
      let skills = response.objects;
      this.setState({skills});
    });
  }

  fetchUserProfile() {
    UserService.get()
    .then(response => {
      this.setState({userSkills: response.habilidades});
    });
  }

  // HANDLES
  onNeighborhoodSelectHandle(index) {
    this.setState({
      neighborhood: this.state.neighborhoods[index]
    });
  }

  onSkillSelectHandle(skill) {
    const userSkills = update(this.state.userSkills, {$push: [skill]});
    const skills = this.state.skills.slice()
    .filter(current => {
      return current.id != skill.id;
    });
    this.setState({userSkills, skills});
  }

  addSkillHandle() {
    if(this.state.skill === '') return;

    let skills = this.state.skills.slice();
    skills.push({nome: this.state.skill});

    this.setState(Object.assign({}, this.state, {
      skills,
      skill: '',
    }));

    // UserService.update({
    //   habilidades: [{id: 4}, {id: 5}],
    // })
    // .then(response => {
    //   console.log('UserService', response);
    // });
  }

  removeSkillHandle() {
    console.log('Remove Skill');
  }

  renderUserSkills() {
    return this.state.userSkills.map((skill, index) => {
      return (
        <View style={styles.listItem} key={index}>
          <Text>{skill.nome}</Text>
          <TouchableOpacity onPress={() => { this.removeSkillHandle(); }} style={styles.itemRemoveIconWrapper}>
            <Icon name="minus" style={styles.itemRemoveIcon}/>
          </TouchableOpacity>
        </View>
      );
    });
  }

  render() {
    return (
      <View style={styles.container}>

        <View style={styles.control}>

          <Text style={styles.inputLabel}>Local onde você mora:</Text>
          <Select placeholder="SELECIONE O BAIRRO" options={this.state.neighborhoods} onSelect={this.onNeighborhoodSelectHandle.bind(this)}></Select>

          <Text style={styles.inputLabel}>Suas habilidades:</Text>
          <Select placeholder="ADICIONE UMA HABILIDADE" options={this.state.skills} onSelect={this.onSkillSelectHandle.bind(this)}></Select>

        </View>

        <ScrollView style={styles.list}>
          {this.renderUserSkills()}
        </ScrollView>

        <TouchableRedirectorWrapper path="/interests" content={
          <View style={styles.btnActionDone}>
            <Text style={styles.btnActionDoneText}>CONTINUAR</Text>
          </View>
        } />


      </View>
    );
  }

}
const inputMargin = 10;
const styles = StyleSheet.create({

  container: {
    height: Dimensions.get('window').height - 70,
  },

  control: {
    marginLeft: inputMargin,
    marginRight: inputMargin,
  },

  inputLabel: {
    marginTop: 10,
    marginBottom: 4,
    marginLeft: 12,
    color: '#757575',
  },
  input: {
    height: 36,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
    color: '#616161',
  },

  addSkillTouchable: {
    position: 'absolute',
    right: 0,
    width: 44,
  },

  addSkillIcon: {
    position: 'absolute',
    right: 0,
    fontSize: 20,
    backgroundColor: '#FAFAFA',
    color: '#BF360C',
    width: 40,
    paddingTop: 8,
    paddingBottom: 5,
    paddingHorizontal: 10,
  },

  list: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ECEFF1',
  },

  listItem: {
    paddingVertical: 14,
    paddingLeft: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ECEFF1',
    backgroundColor: '#FAFAFA',
  },

  itemRemoveIconWrapper: {
    position: 'absolute',
    right: 20,
    marginTop: 10,
  },

  itemRemoveIcon: {
    marginTop: 3,
    fontSize: 20,
    color: '#b71c1c'
  },

  btnActionDone: {
    backgroundColor: '#FBC02D',
    padding: 8,
    margin: 3,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },

  btnActionDoneText: {
    textAlign: 'center',
    color: '#FFF',
    fontSize: 15,
    padding: 4
  }

});
