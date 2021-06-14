import React, { Component } from "react";
import { longdo, map, LongdoMap } from "./LongdoMap";
import styles from "./Map.module.scss";

class Map extends Component {
  constructor(props) {
    super(props);
  }

  initMap() {
    map.Layers.setBase(longdo.Layers.GRAY);
    map.location({ lon: 100.53726, lat: 13.72427 }, true);
  }

  render() {
    const mapKey = "5328d685f92fc9083203a69ada5e5f63";
    return (
      <div className={styles.mapContainer}>
        <LongdoMap id="longdo-map" mapKey={mapKey} callback={this.initMap} />
      </div>
    );
  }
}

export default Map;
