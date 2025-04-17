
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
     <footer className="border-grid border-t bg-amber-50 border-gray-300 py-6 md:py-0  bottom-0 w-full" aria-label="Site Footer">
       <div className="container-wrapper">
         <div className="container py-4">
           <div className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left pl-3">
             Copyright &copy; SMVDU {currentYear}. All Rights Reserved
           </div>
         </div>
       </div>
     </footer>
  )
}
