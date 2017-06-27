import React, { Component } from 'react';

import { Platform, StyleSheet, View, Text, TouchableOpacity } from 'react-native';

import { withRouter } from 'react-router';

import PropTypes from 'prop-types';

import Icon from 'react-native-vector-icons/MaterialIcons';

class Header extends Component {

  static propTypes = {
    title: PropTypes.string.isRequired,
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      title: this.props.title
    };
  }

  openDrawer() {
    this.props.toggleSideMenu();
  }

  render() {
    const { title } = this.state;

    console.log('this.props.location.pathname', this.props.location.pathname);

    return (
      <View style={styles.container}>
        <View style={styles.leftColumn}>
          <TouchableOpacity onPress={()=>{this.openDrawer()}}>
            <Icon name="menu" style={styles.menuIcon} />
          </TouchableOpacity>
        </View>
        <View style={styles.middeColumn}>
          <Text style={styles.title}>{this.props.location.pathname}</Text>
        </View>
        <View style={styles.rightColumn}>
        </View>
      </View>
    );
  }
}

export default withRouter(Header);

// const PADDING_TOP_OS = { ios: 20, android: 20 };
// paddingTop: PADDING_TOP_OS[Platform.OS] || PADDING_TOP_OS.ios,
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#3E2723',
    padding: 10,
    marginTop: 21,
  },
  leftColumn: {
    flex: 1,
  },

  middeColumn: {
    flex: 10,
  },

  rightColumn: {
    flex: 1,
  },

  menuIcon: {
    fontSize: 30,
    color: '#FFF',
  },

  title: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 6,
  }
});
