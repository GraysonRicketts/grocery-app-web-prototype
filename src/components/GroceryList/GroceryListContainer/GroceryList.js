import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { fetchItemsIfNeeded, addItemToBasket } from '../../../actions/itemActions'
import Search from './../Search/Search'
import Category from './../Category/Category'
import Header from '../../Header/Header'
import Footer from '../../Footer/Footer'
import { getBasketFromToken } from '../../../utils/auth'
import { isUserAuthenticated } from './../../../utils/auth'

class GroceryList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showChecked: true,
      basket: getBasketFromToken(),
      requestFulfilled: true
    }

    this.handleShowCheckedToggle = this.handleShowCheckedToggle.bind(this)
  }
  
  componentDidMount() {
    const { fetchItemsIfNeeded } = this.props
    const { basket } = this.state

    this.setState((prevState) => {
      return {
        ...prevState,
        requestFulfilled: fetchItemsIfNeeded(basket)
      }
    })
  }

  handleShowCheckedToggle() {
    this.setState((prevState) => {
      return {
        ...prevState,
        showChecked: !prevState.showChecked
      }
    })
  }

  render() {
    if (!this.state.requestFulfilled || !isUserAuthenticated()) {
      return <Redirect to={'/login'} />
    }

    const { categories, addItemToBasket } = this.props
    return (
      <div>

        <Header />

        <div className="groceryList">
          <Search addItemToBasket={addItemToBasket}/>

          {Object.keys(categories).length > 0 ?
            this.makeList(categories) : this.showBlankBasket()}
        </div>

        <Footer />
      </div>
    )
  }

  makeList(categories) {
    const buttonStyle = {
      fontSize: '.7rem',
      backgroundColor: 'white',
      padding: '3px',
      borderRadius: '2px'
    }

    const helpTextStyle = {
      fontWeight: 300,
      textAlign: 'center',
      margin: '30% 10%'
    }

    return (
      <div>
        {Object.keys(categories).sort().map((name) => {
          let categoryItems = categories[name].items
          if (!this.state.showChecked) {
            categoryItems = categoryItems.filter((item) => {
              return !item.checkedOff
            })
          }

          return categoryItems.length === 0 ? null : (
            <Category
              key={categories[name].id}
              name={name}
              items={categoryItems}
            />
          )
        })}

        {this.props.numItems < 4 ?
          <p style={helpTextStyle}>
            You can modify items by clicking on them.
          </p> : null
        }

        <div style={{
              position: 'absolute',
              bottom: 35,
              textAlign: 'center',
              left: 0, right: 0
            }}>
          <input type='button' name="showChecked" 
          onClick={this.handleShowCheckedToggle}
          value={(this.state.showChecked ? 'Hide' : 'Show') + ' checked items'}
          style={buttonStyle}/>
        </div>
      </div>
    )
  }

  showBlankBasket() {
    const style = {
      fontWeight: 300,
      textAlign: 'center',
      margin: '30% 10%'
    }

    return (
      <div style={style}>
        <p>
          Type in an item on grocery list above and 
          press "Enter" to add it.
        </p>
        <p>
          "3 apples"
        </p>
        <p>
          "4 chicken breasts"
        </p>
      </div>
    )
  }
}

const getCategories = (items) => {
  let categories = {}
  let categoryId = 0

  if (items.length > 0) {
    items.forEach((item) => {
      if (!item) {
        return
      }

      const categoryName = item.itemDef.category
      if (!categories[categoryName]) {
        // Creates category if non already exists
        categories[item.itemDef.category] = { id: categoryId++, items: []}
      }
      categories[categoryName].items.push(item.id)
    })
  }

  return categories
}

function mapStateToProps(state) {
  return {
    categories: getCategories(state.basket.items),
    numItems: state.basket.items.length
  }
}

const mapDispathToProps = {
  fetchItemsIfNeeded,
  addItemToBasket
}

export default connect(
  mapStateToProps,
  mapDispathToProps
)(GroceryList)
