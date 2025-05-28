export function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 dark:border-gray-800 py-4">
      <div className="container flex justify-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          © {new Date().getFullYear()} ChatSocial. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
