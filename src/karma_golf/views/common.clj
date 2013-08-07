(ns karma-golf.views.common
  (:use [noir.core :only [defpartial]]
        [hiccup.page :only [include-css include-js  html5]]))

(defpartial angular[& content]
  [:html {:ng-app ""}
   content
   ]
  )

(defpartial layout [& content]
            (angular
              [:head
               [:title "K A R M A   G A R D E N"]
               (include-css "/css/reset.css")
               (include-css "/css/bootstrap.css")
               (include-css "/css/main.css")
               (include-js "lib/angular/angular.js")
               (include-js "lib/underscore-min.js")
               (include-js "/js/controllers.js")
               ]
              [:body
               [:div#content.row {:ng-controller "gridCtrl"}
                content]]))

