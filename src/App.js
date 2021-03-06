import React, { useEffect, useState } from 'react';

import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  FlatList,
  View,
  Text,
  TouchableOpacity
} from "react-native";

import api from './services/api'

export default function App() {

  const [ repositories, setRepositories ] = useState([]);

  useEffect(() => {
    api.get('repositories').then(response => {
      console.log(response.data)
      setRepositories(response.data);
    })
  }, []);

  async function handleLikeRepository(id) {
    try {
      const response = await api.post(`/repositories/${id}/like`)
      const liked = response.data

      setRepositories(repositories.map((repository) => (
        repository.id === id ? liked : repository
      )))
    } catch(err) {
      console.log('Repository not found')
    }
  }

  async function handleAddRepository(){
    const response = await api.post('repositories', {
      title: `Novo projeto ${Date.now()}`,
      url: 'www.andix.com.br',
      techs: [
        "Teste add",
        "React Native"
      ]
    })

    const repository = response.data;

    setRepositories([...repositories, repository]);
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <FlatList
          data={repositories}
          keiExtractor={repository => repository.id}
          renderItem={({ item: repository }) => (
            <View style={styles.repositoryContainer}>
              <Text style={styles.repository}>{repository.title}</Text>
              <View style={styles.techsContainer}>
                {repository.techs.map(tech => (
                  <Text style={styles.tech} key={tech}>{tech}</Text>
                ))}
              </View>
              <View style={styles.likesContainer}>
                <Text 
                  style={styles.likeText} 
                  testID={`repository-likes-1`}
                  // Remember to replace "1" below with repository ID: {`repository-likes-${repository.id}`}
                >
                  {repository.likes}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleLikeRepository(repository.id)}
                // Remember to replace "1" below with repository ID: {`like-button-${repository.id}`}
                testID={`like-button-1`}
              >
                <Text style={styles.buttonText}>Curtir</Text>
              </TouchableOpacity>
            </View>
          )}
        />
        
        <TouchableOpacity 
          activeOpacity={0.6} 
          style={styles.buttonAdd}
          onPress={handleAddRepository}
        >
          <Text style={styles.buttonTxtAdd}>Adicionar projeto</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },
  buttonAdd: {
    backgroundColor: '#FFF',
    margin: 20,
    height: 50,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonTxtAdd: {
    fontWeight: 'bold',
    fontSize: 16
  }
});
