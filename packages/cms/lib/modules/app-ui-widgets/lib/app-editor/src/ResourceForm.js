import React, { Component, useLocation } from 'react';
import { Map, Marker, Popup, TileLayer, Polyline } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import { FilePond, File, registerPlugin } from 'react-filepond'
import Section from './Layout/Section.js';
import AudioRecorder from 'react-mp3-recorder';

// Import FilePond styles
import 'filepond/dist/filepond.min.css'

// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
// `npm i filepond-plugin-image-preview filepond-plugin-image-exif-orientation --save`
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview)
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});


class LocationPicker extends Component {
  handleClick(e){
    this.props.onPositionChange(e.latlng.lat, e.latlng.lng);
  }

  render() {
    var currentPos = this.props.lat &&  this.props.lng ? [this.props.lat, this.props.lng] : false;

    console.log('currentPos', currentPos)
    return (
      <Map center={currentPos} zoom={12} style={{ width: '100%', height: '250px'}} onClick={this.handleClick.bind(this)}>
        <TileLayer
          url="https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=BqThJi6v35FQeB3orVDl"
          attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
        />
        {currentPos && <Marker position={currentPos}>
          <Popup>A pretty CSS3 popup.<br />Easily customizable.</Popup>
        </Marker>}
      </Map>
    )
  }
}

function AudioRecordField (props) {
  return (
    <div>
      <AudioRecorder
         onRecordingComplete={(blob) => {
           console.log('recording', blob);
         }}
         onRecordingError={(err) => {
           console.log('recording error', err)
         }}
       />
    </div>
  )
}

function AudioUploadField (props) {
  function setFiles ( ) {

  }
  return (
    <div>
      <FilePond
        onupdatefiles={setFiles}
        allowMultiple={true}
        maxFiles={1}
        imagePreviewMinHeight={22}
        imagePreviewMaxHeight={100}
        server="/api"
        name="files"
        labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
      />
    </div>

  )
}

class AudioFormField extends Component {
  constructor(props) {
    super(props);

    this.state = {
      action: null
    };
  }

  render() {
    return (
      <div>
        {this.props.audio
          ?
          <div className="audio-display flex justify-content">
            <small><em>{this.props.audio.filename}</em></small>
            <a href="#" className="ui-button" onClick={() => {
              this.props.update(null);
            }}> x </a>
          </div>
          :
          <div>{!this.state.action && <div class="flex justify-content">
            <a href="#" className="ui-button" onClick={() => {
              this.setState({
                action: 'upload'
              })
            }}>
              Upload audio
            </a>
            <small>
              or
            </small>
            <a href="#" className="ui-button"  onClick={() => {
              this.setState({
                action: 'record'
              })
            }}>
              Record audio
            </a>
          </div>}</div>
        }


        {!this.props.audio && this.state.action &&
          <div style={{textAlign: 'right'}}>
            <a href="#" className="ui-button inline-block" onClick={() => {
              this.setState({
                action: null
              })
            }}> x </a>
          </div>
        }
        {!this.props.audio && this.state.action && this.state.action === 'record' &&

          <AudioRecordField />
        }
        {!this.props.audio && this.state.action && this.state.action === 'upload' &&
          <AudioUploadField

          />
        }
      </div>
    )
  }
}

class ResourceForm extends Component {
  render() {
    var update = (resource, key, value) => {
      this.props.updateResource({
        ...this.props.resource,
        data: {
          ...this.props.resource.data,
          [key]:value
        }
      })
    }

    var handleSort = (sortedData) => {
      const url = '/api/HotelPhotos/PhotoSort';
      console.log('sortedData', sortedData);
    }

  //  const [files, setFiles] = useState([])

    var files = [];
    var setFiles = () => {};
    return (
      <div>{this.props.resource ?
        <div>
          <Section title="location">
            <LocationPicker
              lat={this.props.resource.data.position && this.props.resource.data.position[0] ? this.props.resource.data.position[0] : null}
              lng={this.props.resource.data.position && this.props.resource.data.position[1] ? this.props.resource.data.position[1] : null}
              onPositionChange={function (lat, lng) {
                this.props.updateResource({
                  ...this.props.resource,
                  data: {
                    ...this.props.resource.data,
                    position: [lat, lng]
                  }
                })
              }.bind(this)}
            />
          </Section>
          <Section title="Title">
            <input
              type=""
              name="title"
              defaultValue={this.props.resource.data.title}
              onChange={(event) => {
                update(this.props.resource, 'title', event.currentTarget.value)
              }}
            />
          </Section>
          <Section title="Description">
            <textarea
              type=""
              name="title"
              defaultValue={this.props.resource.data.description}
              onChange={(event) => {
                update(this.props.resource, 'description', event.currentTarget.value)
              }}
            />
            </Section>
          <Section title="Audio">
            <AudioFormField
              audio={this.props.resource.data.audio}
              update={(value) => {
                update(this.props.resource, 'audio', value)
              }}
            />
          </Section>
          <Section title="Images">
            <FilePond
              files={files}
              onupdatefiles={setFiles}
              allowMultiple={true}
              maxFiles={3}
              imagePreviewMinHeight={22}
              imagePreviewMaxHeight={100}
              server="/api"
              name="files"
              labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
            />
            </Section>
          {/*
            <div className="form-group">
            <label> Videos </label>
            <br />

            <input type="" name="name"/>
          </div>
          */}
        </div>
        :
        <div />}
      </div>
    )
  }
}

export default ResourceForm;
