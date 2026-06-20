// src/app/page.tsx
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

// Fungsi logout dengan client async yang bener
async function logout() {
  'use server'
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export default async function Home() {
  const supabase = await createClient()

  // Cek user yang sedang login
  const { data: { user } } = await supabase.auth.getUser()
  
  // Proteksi halaman, kalau belum login langsung tendang
  if (!user) {
    redirect('/login')
  }
  
  // Ambil data santri
  const { data: santriList } = await supabase
    .from('santri')
    .select('*, profiles(full_name)')

  return (
    // Kita paksa background luarnya abu terang biar tabelnya kelihatan kontras
    <div className="w-full min-h-screen bg-slate-50 text-slate-900">
      <main className="p-8 max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8 border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-950 tracking-tight">
              Dashboard Pondok Pesantren
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Login sebagai: <span className="font-semibold text-slate-800">{user?.email}</span>
            </p>
          </div>
          <form action={logout}>
            <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm font-semibold shadow-sm transition-colors">
              Logout
            </button>
          </form>
        </div>

        {/* Table Container */}
        <div className="bg-white shadow-md rounded-xl overflow-hidden border border-slate-200">
          
          {/* Header Internal Tabel */}
          <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
            <h2 className="font-bold text-lg text-slate-900">Daftar Santri Resmi</h2>
            <Link href="/santri/add" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 shadow-sm transition-colors">
              + Tambah Santri
            </Link>
          </div>
          
          <table className="w-full text-left border-collapse m-0 p-0">
            <thead className="bg-slate-100 border-b border-slate-200">
              <tr>
                <th className="p-4 font-bold text-sm text-slate-700 uppercase tracking-wider w-1/4">NIS</th>
                <th className="p-4 font-bold text-sm text-slate-700 uppercase tracking-wider w-1/3">Nama Santri</th>
                <th className="p-4 font-bold text-sm text-slate-700 uppercase tracking-wider w-1/4">Wali</th>
                <th className="p-4 font-bold text-sm text-slate-700 uppercase tracking-wider text-center">Status</th>
              </tr>
            </thead>
            
            <tbody className="bg-white divide-y divide-slate-100">
              {santriList && santriList.length > 0 ? (
                santriList.map((santri) => (
                  <tr key={santri.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Teks data dipaksa gelap pekat (text-slate-900 / text-slate-950) */}
                    <td className="p-4 font-mono text-sm text-slate-950 font-medium">{santri.nis}</td>
                    <td className="p-4 text-base font-semibold text-slate-900">{santri.full_name}</td>
                    <td className="p-4 text-sm text-slate-700 font-medium">
                      {Array.isArray(santri.profiles) 
                        ? santri.profiles[0]?.full_name 
                        : santri.profiles?.full_name || 'Belum ada wali'}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full border ${
                        santri.status === 'aktif' 
                          ? 'bg-green-50 text-green-700 border-green-200' 
                          : 'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        {santri.status?.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-slate-500 font-medium bg-white">
                    📭 Belum ada data santri terdaftar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          
        </div>
      </main>
    </div>
  )
}