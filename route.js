import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Home from "./pages/home"
import Courses from "./pages/courses"
import Articles from "./pages/articles"
import Article from "./pages/article"

const Stack = createStackNavigator();
export default () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{/* headerShown:false */}}
        options={{title: "Awesome"}} initialRouteName="Courses">
          {/* <Stack.Screen name="Home" component={Home}/> */}
          <Stack.Screen name="Courses" component={Courses}/>
          <Stack.Screen name="Articles" component={Articles}/>
          <Stack.Screen name="Article" component={Article}/>
      </Stack.Navigator>      
    </NavigationContainer>   
  )
}