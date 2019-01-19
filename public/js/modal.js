/*
 * @license
 * angular-modal v0.5.0
 * (c) 2013 Brian Ford http://briantford.com
 * License: MIT
 */

'use strict';

angular.module('btford.modal', []).factory('btfModal', ['$animate', '$compile', '$rootScope', '$controller', '$q', '$http', '$templateCache', '$timeout', modalFactoryFactory]);

function modalFactoryFactory($animate, $compile, $rootScope, $controller, $q, $http, $templateCache, $timeout) {
  return function modalFactory (config) {
    if (!(!config.template ^ !config.templateUrl)) {
      throw new Error('Expected modal to have exacly one of either `template` or `templateUrl`');
    }

    var template      = config.template,
        controller    = config.controller || null,
        controllerAs  = config.controllerAs,
        container     = angular.element(config.container || document.body),
        element       = null,
        html,
        scope;

    if (config.template) {
      html = $q.when(config.template);
    } else {
      html = $http.get(config.templateUrl, {
        cache: $templateCache
      }).
      then(function (response) {
        return response.data;
      });
    }

    function activate (locals) {
      // console.log('modaljs:: activate called');
      return html.then(function (html) {
        if (!element) {
          attach(html, locals);
        }
      });
    }

    function addClickEventListenersOn(nodeList) {
      for(var i = 0 ; i < nodeList.length; i++) {
        nodeList[i].addEventListener('click', function(event) {
          event.stopPropagation();
        }, false);
      }
    }

    function attach (html, locals) {
      element = angular.element(html);
      // console.log('modaljs:: attach called', element);
      if (element.length === 0) {
        throw new Error('The template contains no elements; you need to wrap text nodes')
      }
      angular.element(document).keydown(onKeyDown);
      element.on('click', closeModal);
      scope = $rootScope.$new();
      if (controller) {
        if (!locals) {
          locals = {};
        }
        for (var prop in locals) {
          scope[prop] = locals[prop];
        }
        locals.$scope = scope;
        var ctrl = $controller(controller, locals);
        if (controllerAs) {
          scope[controllerAs] = ctrl;
        }
      } else if (locals) {
        for (var prop in locals) {
          scope[prop] = locals[prop];
        }
      }
      $compile(element)(scope);
      return $animate.enter(element, container).then(function(modal) {
        var appModal = document.querySelector('.app-modal');
        // console.log('modaljs:: appModal ', appModal);
        var modalContents = appModal.querySelectorAll('.modal-content');
       
        if(modalContents && modalContents.length) {
          addClickEventListenersOn(modalContents);
          return modal;
        }
        var materialModalContents = appModal.querySelectorAll('.material-modal-content');
        if(materialModalContents && materialModalContents.length) {
          addClickEventListenersOn(materialModalContents);
          return modal;
        }
        // console.log('modaljs:: attach:: found nothing!');
      });
    }

    function deactivate () {
      // console.log('modaljs:: deactivate called', element);
      if (!element) {
        return $q.when();
      }
      return $animate.leave(element).then(function () {
        scope.$destroy();
        scope = null;
        element.remove();
        element = null;
        $animate.off('enter', container);
        angular.element(document).off('keydown');
        // console.log('modaljs:: deactivate:: animate leave');
      });
    }

    function active () {
      return !!element;
    }

    function onKeyDown(event) {
      // console.log('onKeyDown:: ', event.keyCode);
      if(event.keyCode == 27) { // Escape Key Code = 27
        closeModal();
      }
    }

    function closeModal() {
      if (scope && scope.close) {
        // console.log('closeModal:: ', scope, scope.hasOwnProperty('close'));
        scope.close();
        $timeout();
        return;
      }
      deactivate();
      var body = angular.element("body");
      // console.log('closeModal:: body', body);
      if(body.hasClass('ovh')) {
        body.removeClass('ovh');
      }
      $timeout();
    }

    return {
      activate: activate,
      deactivate: deactivate,
      active: active
    };
  };
}
