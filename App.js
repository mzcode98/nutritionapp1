import { StatusBar } from 'expo-status-bar';
import Amplify, {Auth} from 'aws-amplify';
import awsconfig from './aws-exports';
import {withAuthenticator} from 'aws-amplify-react-native'

Amplify.configure(awsconfig)

import React, { useEffect, useState } from 'react'
import {
  View, Text, StyleSheet, TextInput, Button
} from 'react-native'

import { API, graphqlOperation } from 'aws-amplify'
import { createTodo } from './src/graphql/mutations'
import { listTodos } from './src/graphql/queries'

const initialState = { name: '', description: '' }

const App = () => {
  const [formState, setFormState] = useState(initialState)
  const [todos, setTodos] = useState([])

  useEffect(() => {
    fetchTodos()
  }, [])

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value })
  }

  async function fetchTodos() {
    try {
      const todoData = await API.graphql(graphqlOperation(listTodos))
      const todos = todoData.data.listTodos.items
      setTodos(todos)
    } catch (err) { console.log('error fetching todos') }
  }

  async function addTodo() {
    try {
      const todo = { ...formState }
      setTodos([...todos, todo])
      setFormState(initialState)
      await API.graphql(graphqlOperation(createTodo, {input: todo}))
    } catch (err) {
      console.log('error creating todo:', err)
    }
  }

// function App() {
//   const [text1, setText1] = useState('');
//   const [text2, setText2] = useState('');
  return (
    <View style={styles.container}>
      <TextInput
        onChangeText={val => setInput('name', val)}
        style={styles.input}
        value={formState.name}
        placeholder="Name"
      />
      <TextInput
        onChangeText={val => setInput('description', val)}
        style={styles.input}
        value={formState.description}
        placeholder="Description"
      />
      <Button title="Create Todo" onPress={addTodo} />
      {
        todos.map((todo, index) => (
          <View key={todo.id ? todo.id : index} style={styles.todo}>
            <Text style={styles.todoName}>{todo.name}</Text>
            <Text>{todo.description}</Text>
          </View>
        ))
        }
    </View>
  )
}
  

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center'},
  todo: {  marginBottom: 15 },
  input: { height: 50, backgroundColor: '#ddd', marginBottom: 10, padding: 8 },
  todoName: { fontSize: 18 }
})

export default withAuthenticator(App, true);



/* <Text>Smile Translator!</Text>
<StatusBar style="auto" />
<TextInput
  style={{height: 40}}
  placeholder="Type here to translate!"
  onChangeText={text1 => setText1(text1)}
  defaultValue={text1}
/>
<Text style={{padding: 10, fontSize: 42}}>
  {text1.split(' ').map((word) => word && ':)').join(' ')}
</Text>
<Text>Frown Translator!</Text>
<StatusBar style="auto" />
<TextInput
  style={{height: 40}}
  placeholder="Type here to translate!"
  onChangeText={text2 => setText2(text2)}
  defaultValue={text2}
/>
<Text style={{padding: 10, fontSize: 42}}>
  {text2.split(' ').map((word) => word && ':(').join(' ')} */
