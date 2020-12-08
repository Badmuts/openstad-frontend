import React, { useEffect, useState } from "react";
import axios from "axios";
import { View, Text, StyleSheet, ImageBackground, TouchableHighlight} from "react-native";
import { SafeBackgroundImage } from "./presentation";
import { Link } from '@react-navigation/native';

const styles = StyleSheet.create({
  container: {
    fontFamily: "Cochin"
  },
  container: {
    fontFamily: "Cochin"
  }
});

const defaultListItemStylesOuter = {
  marginBottom: 8
}

const defaultListItemStylesInner = {
  padding: 5,
  minHeight: 80,
}

const NoResults = (props) => {
  return <Text> No results </Text>;
}

const Loader = (props) => {
  return <Text> Loading... </Text>;
}

const CardItem = (props) => {
  const titleKey = props.titleKey ? props.titleKey : 'title';

  return <Text> {props.item[titleKey]}  </Text>;
}

const ListItem = (props) => {
  const titleKey = props.titleKey ? props.titleKey : 'title';
  const backgroundImage = props.backgroundImageKey  && props.item[props.backgroundImageKey] ?  props.item[props.backgroundImageKey] : (props.defaultBackgroundImage ? props.defaultBackgroundImage : false);
  const innerStyles = {...defaultListItemStylesInner, ...(props.styles || {})}


  return (
    <View style={defaultListItemStylesOuter}>
      <SafeBackgroundImage backgroundImage={backgroundImage}>
        <Text style={innerStyles}>
          {props.item[titleKey]}
        </Text>
      </SafeBackgroundImage>
    </View>
  );
    ;
}

const displayTypes = {
  'list' : ListItem,
  'card' : CardItem
}
//  <Link to="/game/1" style={{display: 'flex'}}>
//</Link>

const DisplayItems = (props) => {
  const DisplayItem = props.displayType ? displayTypes[props.displayType] : displayTypes['list'];

  return (
    <View>
    {props.items.map((item, i) => {
      return (
        <TouchableHighlight onPress={() => props.navigation.navigate(props.resource, {id: item.id})}>
          <DisplayItem {...props} item={item} key={i}/>
        </TouchableHighlight>
      )
    })}
    </View>
  )
}

const ResourceOverview = (props) => {
  const resourceType = props.resources.find((resource) => {
    return props.resource === resource.name;
  });

  const apiUrl = `${resourceType.apiBase}/${resourceType.apiPath}`;

  const [resources, setResources] = useState({items: [], isFetching: false});

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setResources({items: resources.items, isFetching: true});
        const response = await axios.get(apiUrl);
        const json = response.data;
        // if response key isset the items are found there, otherwise they are directly at the root of the response opbject

        const items = resourceType.responseKey ? json[resourceType.responseKey] : json;
        setResources({items: items, isFetching: false});
      } catch (e) {
        console.log(e);
        setResources({items: resources.items, isFetching: false});
      }
    };
    fetchResources();
  }, []);

  console.log('resources.items', resources.items)

  return (
    <View style={styles.container}>
      {resources.items ?
        <DisplayItems {...props} items={resources.items}  /> :
        (resources.isFetching ? <Loader /> : <NoResults />)
      }
    </View>
  );
};

const Overview = (props) => {

  return <ResourceOverview {...props} />;
}

export default Overview;
