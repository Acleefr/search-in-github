import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ScrollView, ActivityIndicator, Image, StyleSheet, Text, View, SafeAreaView, TextInput, Button, Keyboard, TouchableWithoutFeedback, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';


export default function App() {
  
  const [isUserLoading, setUserLoading] = useState(true);
  const [isReposLoading, setReposLoading] = useState(true);
  const [username, setUsername] = useState('quentinleguellanff')
  const [repos, setRepos] = useState([])
  const [userData, setUserData] = useState([]);
  const [reposData, setReposData] = useState([]);
  
  const fetchUser = async (username) => {
    try {
      /*const { NGROK_URL } = process.env;
      const response = await fetch(`${NGROK_URL}/api/users/${username}`);*/
      const response = await fetch(`http://4da5-2a01-e0a-2c-3330-79dc-606-673c-bad8.ngrok.io/api/users/${username}`);
      const json = await response.json();
      if(json.user) {
        setUserData(json.user);
        fetchRepos(json.user.username)
      }
      else{
        setUserData(json)
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUserLoading(false);
    }
  }

  const fetchRepos = async (username) => {
    try {
      const response = await fetch(`http://4da5-2a01-e0a-2c-3330-79dc-606-673c-bad8.ngrok.io/api/users/${username}/repos`);
      const json = await response.json();
      if(json.repos){
          setReposData(json.repos)
      }
      else{
        setReposData(json)
      }
    } catch (error) {
      console.error(error);
    } finally {
      setReposLoading(false);
    }
  }

  async function search() {
    try {
      const responseUser = await fetchUser(username)
      if(responseUser){
        const user = await responseUser.json();
        setUser(user);
      }
      const responseRepos = await fetchRepos(username)
      if(responseRepos){
        const repos = await responseRepos.json();
        setRepos(repos)
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchUser('quentinleguellanff');
    fetchRepos('quentinleguellanff');
  },[]);

  return (
      <SafeAreaView style={styles.container}>
          <View style={styles.textAndButton}>
            <TextInput
              style={styles.input}
              placeholder="enter a Github username"
              onChangeText={setUsername}
              returnKeyType="search"
              onSubmitEditing={search}
              autoCorrect={false}
            />
            <Button 
            title="Search"
            onPress={search}
            />
          </View>
          {userData.message ? <View style={styles.userContainer}><Text style={{fontSize:16}}>{userData.message}</Text></View> : (
            <View style={styles.userContainer}>
              {isUserLoading ? <ActivityIndicator/> : (
                <View>
                  <View style={styles.userHeader}>
                      <Image
                        style={styles.avatar}
                        source={{uri : userData.avatar_url}}
                      />
                    <View>
                      <Text style={ styles.title }>{userData.name}</Text>
                      <Text style={ styles.login }>{userData.username}</Text>
                    </View>
                  </View>
                  <View style={{flex: 30}}>
                    <Text> {userData.bio} </Text>
                    <Text style={styles.text}> {userData.email} </Text>
                    <Text style={styles.text}><Icon name="people-outline" size={20} /> {userData.followers} followers - {userData.following} following</Text>
                    <Text style={ styles.repos }> Repositories <Text style={{backgroundColor: "lightgrey"}}> {userData.public_repos} </Text></Text>
                  
                      {isReposLoading ? <ActivityIndicator/> : (
                          <FlatList
                          style={styles.reposList}
                          data={reposData}
                          keyExtractor={({ id }) => id}
                          renderItem={({ item }) => (
                            <View style={styles.repoRowContainer}>
                            <Text style={{fontSize: 22, color: '#7075db', fontWeight: 'bold'}}> {item.name} <Text style={styles.visibility}> {item.visibility} </Text></Text>
                            <Text style={{fontStyle:'italic', paddingTop: 5, paddingBottom: 5}}> {item.description}</Text>
                            <Text style={{fontSize: 14}}><Icon name="ellipse" color="#ede321" /> {item.language} <Text style={{fontSize: 10}}>last update {item.updated_at}</Text></Text>
                            </View>
                          )}
                        />
                      )}
                  </View>
                </View>
                )}
            </View> 
          )}
        <StatusBar style="auto" />
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  textAndButton: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    flex: 1
  },
  input: {
    fontSize: 18
  },
  userContainer: {
    flex: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold'
  },
  avatar: {
    width: 80,
    height: 80,
    margin: 5,
    borderRadius: 40,
    overflow: "hidden",
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: 'flex-start',
  },
  repos: {
    textAlign: 'center',
    padding: 10,
    fontSize: 22,
  },
  text: {
    fontSize: 16,
    padding: 5
  },
  reposList: {
    flex: 1,
  },
  repoRowContainer: {
    padding: 5,
    margin: 5
  },
  visibility: {
    fontSize: 14, 
    color: 'black', 
    fontWeight: 'normal',
  }
});
