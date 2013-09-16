(ns karma-golf.models.game
  (:require [karma-golf.models.db :as db]
            [criterium.core :as bench]
            )
  )

(defn build-game [subreddits]
  {:score 0
   :threads (zipmap subreddits (map db/get-random-thread subreddits))
   }
  )

(defn next-comment
  "The next comment from the thread, and return the comment and an updated thread vector."
  [thread]
  (let [randthread  (shuffle thread)
        comment (first randthread)
        kids (:replies comment)
        good-kids (map #(assoc % :parent-body (:body-html comment)) kids)
        new-thread (concat (rest randthread) good-kids)
        ]
    [comment new-thread]
    )
  )

