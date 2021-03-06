/*
 * Copyright (c) 2015-2018 Red Hat, Inc.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *   Red Hat, Inc. - initial API and implementation
 */
'use strict';

interface ICheFormatOutputAttributes extends ng.IAttributes {
  ngModel: string;
}

/**
 * Defines a directive for formatting output.
 * @author Ann Shumilova
 */
export class CheFormatOutput implements ng.IDirective {
  restrict = 'A';

  outputColors: any;
  $compile: ng.ICompileService;

  /**
   * Default constructor that is using resource
   * @ngInject for Dependency injection
   */
  constructor(jsonOutputColors: string,
              $compile: ng.ICompileService) {
    this.outputColors = angular.fromJson(jsonOutputColors);
    this.$compile = $compile;
  }

  /**
   * Keep reference to the model controller
   */
  link($scope: ng.IScope, $element: ng.IAugmentedJQuery, $attrs: ICheFormatOutputAttributes): void {
    $scope.$watch(() => { return $attrs.ngModel; }, (value: string) => {
      if (!value || value.length === 0) {
        return;
      }

      let regExp = new RegExp('\n', 'g');
      let result = value.replace(regExp, '<br/>');

      this.outputColors.forEach((outputColor: any) => {
        regExp = new RegExp('\\[\\s*' + outputColor.type + '\\s*\\]', 'g');
        result = result.replace(regExp, '[<span style=\"color: ' + outputColor.color + '\">' + outputColor.type + '</span>]');
      });

      result = '<span>' + result + '</span>';

      $element.html(this.$compile(result)($scope).html());
    });
  }
}

