import { useEffect, useState } from 'react'
import './App.css'

type Item = {
  id: number
  title: string
  image: string
  price: number
  orders: Order[]
}

type Order = {
  id: number
  userId: number
  itemId: number
  item: Item
  quantity: number
}

type User = {
  id: number
  name: string
  email: string
  password: string
  orders: Order[]
}

function App() {
  const [user, setUser] = useState<null | User>(null)

  useEffect(() => {
    validate()
  }, [])

  function signIn(email: string, password: string) {
    fetch('http://localhost:4000/sign-in', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    }).then(resp => resp.json())
      .then(data => {
        if (data.error) {
          alert(data.error)
        } else {
          //from the data we get token and user
          //we store the token in local storage
          localStorage.token = data.token
          setUser(data.user)
        }
      })
  }

  function signUp(name: string, email: string, password: string) {
    fetch('http://localhost:4000/sign-up', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password })
    }).then(resp => resp.json())
      .then(data => {
        if (data.error) {
          alert(data.error)
        } else {
          //from the data we get token and user
          //we store the token in local storage
          localStorage.token = data.token
          setUser(data.newUser)
        }
      })
  }

  function validate() {
    if (localStorage.token) {
      fetch('http://localhost:4000/validate', {
        headers: {
          Authorization: localStorage.token
        }
      }).then(resp => resp.json())
        .then(data => {
          if (data.error) {
            alert(data.error)
          } else {
            setUser(data)
          }
        })
    }
  }

  function signOut () {
    localStorage.removeItem('token')
    setUser(null)
  }

  if (user === null)
    return (
      <div className="App">
        <h1>Welcome Stranger!!</h1>
        <form onSubmit={e => {
          e.preventDefault()
          //@ts-ignore
          const email = e.target.email.value
          //@ts-ignore
          const password = e.target.password.value
          signIn(email, password)
        }}>
          <input type="email" placeholder='email' name='email' />
          <input type="password" placeholder='password' name='password' />
          <button type='submit'>Sign in</button>
        </form>

        <h2>Dont have an account? Sign up!</h2>
        <form onSubmit={e => {
          e.preventDefault()
          //@ts-ignore
          const name = e.target.name.value
          //@ts-ignore
          const email = e.target.email.value
          //@ts-ignore
          const password = e.target.password.value
          signUp(name, email, password)
        }}>
          <input type="text" placeholder='name' name='name' />
          <input type="email" placeholder='email' name='email' />
          <input type="password" placeholder='password' name='password' />
          <button type='submit'>Sign up</button>
        </form>
      </div>
    )

  ////question for nico: HOW DO WE GET USER FROM BACKEND AND NOT ORDER?
  function deleteOrder(id: Number) {
    if (user === null) return

    fetch(`http://localhost:4000/orders/${id}`, { method: 'DELETE' })
      .then(resp => resp.json())
      .then(data => {
        if (data.error) {
          alert(data.error)
        } else {
          setUser(data)
        }
      })
  }

  function updateQuantity(id: number, newQuantity: number) {
    fetch(`http://localhost:4000/orders/${id}`, {
      method: 'PATCH',
      headers: {
        Authorization: localStorage.token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ newQuantity })
    }).then(resp => resp.json())
      .then(data => {
        setUser(data.user)
      })
  }

  return (
    <div className='App'>
      <h1>Welcome {user.name}</h1>
      <button onClick={signOut}>Sign Out</button>
      <h2>Your orders are:</h2>
      <ul className='orders-list'>
        {user.orders.map(order => (
          <li className='order'>
            <div className='order-image'>
              <img src={order.item.image} alt="" />
            </div>
            <div className='order-info'>
              ${order.item.price}
              <select
                value={order.quantity}
                onChange={e => {
                  const newQuantity = Number(e.target.value)
                  if (newQuantity === 0) {
                    deleteOrder(order.id)
                  } else {
                    updateQuantity(order.id, newQuantity)
                  }
                }}
              >
                <option>0</option>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
                <option>6</option>
                <option>7</option>
                <option>8</option>
                <option>9</option>
              </select>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}


export default App
