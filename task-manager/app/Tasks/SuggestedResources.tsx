import React from 'react'
import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'

interface Resource {
  title: string
  link: string
}

interface SuggestedResourcesProps {
  suggestedResources: string[]
}

const parseResource = (resource: string): Resource => {
  const [title, link] = resource.split(': ')
  return {
    title: title.trim(),
    link: link.replace(/[\[\]]/g, '').trim()
  }
}


export function SuggestedResources({ suggestedResources }: SuggestedResourcesProps) {
  const parsedResources = suggestedResources.map(parseResource)

  return (
    <div className="w-full  mx-auto ">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {parsedResources.length > 0 ? (
          parsedResources.map((resource, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-lg text-gray-900 truncate">
                    {resource.title}
                  </h3>
                  <a
                    href={resource.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-600 transition-colors duration-200"
                    aria-label={`Visit ${resource.title} (opens in a new tab)`}
                  >
                    <ExternalLink size={20} />
                  </a>
                </div>
                <p className="text-sm text-gray-600">
                  Click the link icon to visit the resource.
                </p>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-600 col-span-full text-center py-4">No resources available</p>
        )}
      </div>
    </div>
  )
}

