'use client';

import { useEffect, useState } from 'react';

// Other imports...
import { supabase } from '@/hooks/supabaseClient';
import { useUser } from '@clerk/nextjs';
import { ArchiveBoxIcon, Squares2X2Icon, SquaresPlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Button } from 'aspect-ui/Button';
import { useRouter } from 'next/navigation';
import { Pagination } from 'aspect-ui';
import { ChevronDoubleLeftIcon } from '@heroicons/react/24/outline';
import { ChevronDoubleRightIcon } from '@heroicons/react/24/outline';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

const page = () => {
  const { user } = useUser();
  const router = useRouter();
  console.log(user);

  const [sites, setSites] = useState([{ name: '', domain: '' }]);
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 5; // Set the number of items per page

  useEffect(() => {
    const loadSites = async () => {
      const { data, error } = await supabase.from('sites').select('*').eq('user_id', user?.id);
      if (error) {
        console.log(error);
        return null;
      }
      console.log(data);
      setSites(data);
    };
    loadSites();
  }, []);

  useEffect(() => {
    const loadPages = async () => {
      const { data, error } = await supabase
        .from('pages')
        .select('*', { count: 'exact' }) // Fetch total count
        .eq('user_id', user?.id)
        .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1);

      if (error) {
        console.log(error);
        return null;
      }

      console.log(data);
      setPages(data);

      // Fetch total count
      const { count } = await supabase
        .from('pages')
        .select('*', { count: 'exact', head: true }) // Get total count
        .eq('user_id', user?.id);

      setTotalPages(Math.ceil(count / itemsPerPage)); // Calculate total pages
    };

    loadPages(); // Call loadPages when the component mounts or currentPage changes
  }, [currentPage, user]); // Dependency array includes currentPage

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    // loadPages() is now called in the useEffect above
  };

  const handlePostStatusChange = async (status) => {
    const { data, error } = await supabase.from('pages').select('*').eq('user_id', user?.id).eq('status', status);
    if (error) {
      console.log(error);
      return null;
    }
    console.log(data);
    setPages(data);
  };

  return (
    <div>page

      {/* <Modal isOpenExternal={sites.length == 0 ? true : false}>
        <ModalContent className='bg-white p-6'>
Hello
<Input value={''} onChange={(e) => { 
    setSites([...sites, { name: e.target.value }]); 
}} />
<Input value={''} onChange={(e) => { 
    setSites([...sites, { domain: e.target.value }]); 
}} />
<ModalAction>Close</ModalAction>
        </ModalContent>
        </Modal> */}
      <div className="aspect-dashboard">
        {/* <h2 className="text-lg font-bold mb-4">Accordion Dashboard</h2> */}
        <div className="flex gap-5 items-center">
          <Button
            icon={<Squares2X2Icon className="size-5" />}
            className="mb-4"
            onClick={() => {
              handlePostStatusChange("publish");
            }}>
            Published Items
          </Button>
          <Button
            icon={<ArchiveBoxIcon className="size-5" />}
            className="mb-4"
            onClick={() => {
              handlePostStatusChange("draft");
            }}>
            Drafted Items
          </Button>
          <Button
            icon={<TrashIcon className="size-5" />}
            className="mb-4"
            onClick={() => {
              handlePostStatusChange("trash");
            }}>
            Trashed Items
          </Button>
        </div>
        <Button
          onClick={() => { router.push('/editor') }}
          icon={<SquaresPlusIcon className="size-5" />}
          className="mb-4">
          Create New
        </Button>
        {/* {selectedAccordions.length > 0 && (
          <div className="flex gap-3 mb-4">
            <Button
              // onClick={() => handleBulkUpdate(selectedAccordions, "publish")}
              className="bg-primary-500">
              Move to Publish
            </Button>
            <Button
              // onClick={() => handleBulkUpdate(selectedAccordions, "draft")}
              className="bg-secondary-500">
              Move to Draft
            </Button>
            <Button
              // onClick={() => handleBulkUpdate(selectedAccordions, "trash")}
              className="bg-danger-500">
              Move to Trash
            </Button>
          </div>
        )} */}
        {/* ***pages list  */}
        <ul>
          {pages && pages.map((page, index) => {
            
            return(
            <li key={index}>{page.name} {" "} <Link href={`/editor/${page.id}`}>Edit</Link> {" "} <Link href={`/preview/${page.id}`}>Preview</Link></li>
          )})}
        </ul>
        {
          <Pagination
            className="mt-4"
            count={totalPages} // Use totalPages from state
            defaultPage={currentPage} // Use currentPage from state
            boundaryCount={2}
            siblingCount={1}
            showFirstLast={totalPages > 5 ? true : false}
            showNextPrev={true}
            numberType="roman"
            firstButton={<ChevronDoubleLeftIcon className="size-4" />}
            lastButton={<ChevronDoubleRightIcon className="size-4" />}
            nextButton={<ChevronRightIcon className="size-4" />}
            previousButton={<ChevronLeftIcon className="size-4" />}
            onChange={handlePageChange}
          />}
      </div>
    </div>
  )
}

export default page