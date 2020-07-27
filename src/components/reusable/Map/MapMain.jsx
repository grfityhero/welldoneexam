import React, { useState, useEffect } from "react"
import { Map, Marker, Popup, TileLayer } from "react-leaflet"
import "./MainMap.scss"
import MainContext from "../../../context/MainContext"
import { COORDS_FROM_MAP } from "../../../Types/CategoriesTypes"

function MapMain({ itmIndex }) {
  const { state, dispatch, toolsState } = React.useContext(MainContext)
  const [position, setposition] = useState(null)
  const [curLocation, setcurLocation] = useState([])

  useEffect(() => {
    let coordArr = []
    let locArr = []
    let newPosition = []
    state.locations.map((location) => {
      switch (toolsState.selectedentity) {
        case "categories":
          if (location.category === state.activeCategory) {
            newPosition = [location.coordinatesLat, location.coordinatesLong]

            coordArr.push(newPosition)
            locArr.push(location.name)

            /*  newPosition[0] && newPosition[1] && */
          }
        case "locations":
          if (location.name === state.activeLocation.name) {
            newPosition = [location.coordinatesLat, location.coordinatesLong]
            newPosition[0] &&
              newPosition[1] &&
              setposition([newPosition[0], newPosition[1]])
            setcurLocation(location.name)
          }
        default:
      }
    })

    if (toolsState.selectedentity === "categories") {
      setposition(coordArr[itmIndex])
      setcurLocation(locArr[itmIndex])
    }
  }, [
    state.activeCategory,
    state.activeLocation,
    toolsState.selectedentity,
    itmIndex,
  ])
  const handleMapClick = (e) => {
    if (toolsState.selectedentity === "locations" && toolsState.editMode) {
      let tmpArr = []
      tmpArr.push(e.latlng.lat)
      tmpArr.push(e.latlng.lng)
      dispatch({ type: COORDS_FROM_MAP, payload: tmpArr })
    } else {
      dispatch({ type: COORDS_FROM_MAP, payload: [] })
    }
  }
  return (
    <div className="map-wrapper">
      Here - {position}
      <Map onClick={handleMapClick} center={position} zoom={12}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position}>
          <Popup>
            {state.activeLocation ? (
              <>
                <div className="">{state.activeLocation.category}</div>
                <div className="">{curLocation}</div>
              </>
            ) : (
              <>
                <div className="">{state.activeCategory}</div>
                <div className="">{curLocation}</div>
              </>
            )}
          </Popup>
        </Marker>
      </Map>
    </div>
  )
}

export default MapMain