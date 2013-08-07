(ns karma-golf.models.db
  (:require [clojure.data.json :as json]
            [monger.core :as mg]
            [monger.collection :as coll]
            )
  (:use karma-golf.models.utils)
  )

(def db-uri "mongodb://jeikens:wowzazepos@ds037468.mongolab.com:37468/heroku_app17301729")
