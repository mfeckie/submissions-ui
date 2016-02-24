import _ from 'lodash/lodash';
import Ember from 'ember';
import ENV from 'submissions-ui/config/environment';
import $ from 'jquery';
import Document from '../models/document';

export default Ember.Component.extend({
  tagName: 'nop-document-uploader',
  descriptionRequired: false,
  accepts: null,
  message: null,
  progress: null,
  progressStyle: Ember.computed('progress', function() {
    return new Ember.Handlebars.SafeString(`width: ${this.get('progress')}%`);
  }),
  showProgress: Ember.computed('progress', function() {
    return this.get('progress') !== null;
  }),

  _fileValid(fileName) {
    const accepts = this.get('accepts');
    return accepts === null || _.any(accepts.split(','), function(docType) {
      return _.endsWith(fileName.toLowerCase(), docType);
    });
  },
  _fileAdded(file) {
    if (this._fileValid(file.name)) {
      this.set('progress', 0);
      this.set('message', 'Currently uploading, please wait…');
      return true;
    } else {
      this.set('progress', null);
      this.set('message', `'${file.name}' is not a valid file type`);
      return false;
    }
  },
  _progressUpdated(file) {
    this.set('progress', file.progress() * 100);
  },
  _uploadCompleted(file, token) {
    this.set('message', null);
    this.set('progress', null);

    const newDocument = Document.create();
    newDocument.set("token", token);
    newDocument.set("name", file.name);
    newDocument.set("size", file.size);
    newDocument.set("preview", file.preview ? file.preview.toDataURL('image/jpeg', 0.5) : null);
    newDocument.set("descriptionRequired", this.get("descriptionRequired"));
    this.sendAction('documentAdded', newDocument);
  },
  _uploadFailed(file) {
    this.set('progress', null);
    this.set('message', `Upload failed for '${file.name}'. Please check your connection and try again`);
  },
  _initialiseUploader: function() {
    const self = this;
    const uploader = this.$();
    const fileDropZone = this.$().find('.file-picker');
    const fileInput = this.$().find('input:file');
    const signatureEndpoint = `${ENV.APP.API_ENDPOINT}/api/v1/submissions/file/sign`;

    function getPresignedPostUrl(callback) {
      $.get(signatureEndpoint)
       .done(callback)
       .fail(function() {
        self.set('message', "We're having trouble preparing to upload. Please check your connection");
        setTimeout(getPresignedPostUrl, 1000, callback);
      });
    }

    function onFileUploadAdd(e, data) {
      const file = data.files[0];
      if (self._fileAdded(file)) {
        self.set('message', `Preparing to upload '${file.name}'...`);
        self.set('progress', 0);
        getPresignedPostUrl(function (presignedData) {
          data.url = presignedData.url;
          data.formData = presignedData.formData;
          data.submit();
          self.set('message', `Uploading '${file.name}'...`);
        });
      }
    }

    function onFileUploadProgressAll(e, data) {
      self._progressUpdated({progress: () => data.loaded / data.total});
    }

    function onFileUploadAddOne(e, data) {
      const token = data.response().result.getElementsByTagName('Key')[0].childNodes[0].nodeValue;
      self._uploadCompleted(data.files[0], token);
      // reset file input
      fileInput.wrap('<form>').parent('form').trigger('reset');
      fileInput.unwrap();
    }

    function onFileUploadFail(e, data) {
      self._uploadFailed(data.files[0]);
    }


    uploader.fileupload({
      fileInput:          fileInput,
      dropZone:           fileDropZone,
      type:               'POST',
      autoUpload:         false,
      paramName:          'file', // S3 does not like nested name fields i.e. name="user[avatar_url]"
      dataType:           'XML',  // S3 returns XML if success_action_status is set to 201
      replaceFileInput:   false,
      previewMinWidth:    760,
      previewMaxWidth:    760,
      previewMinHeight:   550,
      previewMaxHeight:   550,
      previewThumbnail:   false,
      disableImageResize: true})
      .on('fileuploadadd', onFileUploadAdd)
      .on('fileuploadprogressall', onFileUploadProgressAll)
      .on('fileuploaddone', onFileUploadAddOne)
      .on('fileuploadfail', onFileUploadFail);


    fileDropZone.on('click', function(e) {
      fileInput.click();
      e.preventDefault();
    });

    $(document.body).on('dragover drop', function(e) {
      e.preventDefault();
    });

    fileDropZone.on('dragenter', function() {
      fileDropZone.addClass('drag-over');
    });

    fileDropZone.on('dragleave drop', function() {
      fileDropZone.removeClass('drag-over');
    });

  }.on('didInsertElement')
});
