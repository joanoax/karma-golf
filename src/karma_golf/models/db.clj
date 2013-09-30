(ns karma-golf.models.db
  (:use monger.operators)
  (:require [clojure.data.json :as json]
            [monger.core :as mg]
            [monger.collection :as coll]
            [monger.conversion :as conv]
            [monger.query :as qry]
            )
  (:use karma-golf.models.utils)
  )

(def db-uri "mongodb://jeikens:wowzazepos@ds037468.mongolab.com:37468/heroku_app17301729")
(def thread-coll "threads")
(def loaded-reddits ["science" "worldnews" "askReddit" "IAmA" "gaming" "movies" "WTF" "todayilearned"])

(defn jack-in! []
  (mg/connect-via-uri! db-uri)
  )

(defn vec-to-map [vec]
  {:comments vec}
  )


(defn download-to-db
  "Downloaded all posts on subreddit front page, cleans them, and loads them into the database."
  [subreddit]
  (let [comms (comment-maps subreddit)
        cleaned (map clean-comments comms)
        ]
      (coll/insert-batch "threads" cleaned)
      )
  )

(defn get-random-thread [subreddit]
    (let [query {:subreddit subreddit :num_comments {$gt 100}}
          count (coll/count "threads" query)]
     (first (qry/with-collection thread-coll
        (qry/find query)
        (qry/skip (rand-int count))
        (qry/limit 1)
        )
      ))
    )

(defn tally-subreddits []
  (let [mapz (coll/find-maps "threads")]
    (doseq [map mapz]
      (println (:subreddit map)))))
    


