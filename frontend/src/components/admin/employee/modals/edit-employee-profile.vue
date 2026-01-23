<template>
  <div
    class="fixed inset-0 bg-gray-800 bg-opacity-30 flex justify-center items-center z-50 w-min-screen"
  >
    <div class="rounded-[15px] shadow-lg fixed top-20">
      <div class="w-auto bg-white text-[13px] rounded-[15px] shadow-lg">
        <div
          class="w-full p-5 py-3 bg-blue-900 text-white rounded-t-[15px] flex justify-between items-center border-b shadow"
        >
          <div class="flex gap-1 items-center">
            <icon :name="'add-students'" />
            <h1 class="font-bold tracking-wide text-lg">
              Edit Employee Profile
            </h1>
          </div>

          <icon
            :name="'circle-close3'"
            @click="closeAdd"
            class="cursor-pointer"
          />
        </div>

        <div class="flex gap-5 p-5 text-gray-700 font-semibold">
          <div
            @click="toggleSection('personal')"
            :class="{
              'text-blue-500 hover:text-red-900 text-[13px] border-b-2 pb-1 border-blue-500 ':
                activeSection === 'personal',
            }"
            class="cursor-pointer"
          >
            PERSONAL INFORMATION
          </div>
          <div
            @click="toggleSection('address')"
            :class="{
              'text-blue-500 hover:text-red-900 text-[13px] border-b-2 pb-1 border-blue-500 ':
                activeSection === 'address',
            }"
            class="cursor-pointer"
          >
            ADDRESS
          </div>

          <div
            @click="toggleSection('education')"
            :class="{
              'text-blue-500 hover:text-red-900 text-[13px] border-b-2 pb-1 border-blue-500 ':
                activeSection === 'education',
            }"
            class="cursor-pointer"
          >
            EDUCATIONAL BACKGROUND
          </div>

          <div
            @click="toggleSection('civil')"
            :class="{
              'text-blue-500 hover:text-red-900 text-[13px] border-b-2 pb-1 border-blue-500 ':
                activeSection === 'civil',
            }"
            class="cursor-pointer"
          >
            CIVIL SERVICE ELIGIBILITY
          </div>
          <div
            @click="toggleSection('learning')"
            :class="{
              'text-blue-500 hover:text-red-900 text-[13px] border-b-2 pb-1 border-blue-500 ':
                activeSection === 'learning',
            }"
            class="cursor-pointer"
          >
            LEARNING AND DEVELOPMENT
          </div>

          <div
            @click="toggleSection('others')"
            :class="{
              'text-blue-500 hover:text-red-900 text-[13px] border-b-2 pb-1 border-blue-500 ':
                activeSection === 'others',
            }"
            class="cursor-pointer"
          >
            OTHER INFORMATION
          </div>
        </div>

        <!-- Personal Information Content -->
        <div
          v-if="activeSection === 'personal'"
          class="overflow-y-auto max-h-[700px] space-y-3 text-left pl-5 pr-5"
        >
          <div class="text-gray-700 space-y-4 border rounded-md p-2">
            <!-- First Row -->
            <div class="flex flex-row gap-3">
              <div class="flex flex-col space-y-2">
                <label class="font-semibold">First Name :</label>
                <input
                  v-model="form.first_name"
                  type="text"
                  class="px-3 py-2 border w-[300px] border-gray-300 rounded-md text-gray-700"
                  placeholder="Enter first name ..."
                />
              </div>
              <div class="flex flex-col space-y-2">
                <label class="font-semibold">Middle Name :</label>
                <input
                  v-model="form.middle_name"
                  type="text"
                  class="px-3 py-2 border w-[300px] border-gray-300 rounded-md text-gray-700"
                  placeholder="Enter middle name ..."
                />
              </div>
              <div class="flex flex-col space-y-2">
                <label class="font-semibold">Last Name :</label>
                <input
                  v-model="form.last_name"
                  type="text"
                  class="px-3 py-2 border w-[300px] border-gray-300 rounded-md text-gray-700"
                  placeholder="Enter last name ..."
                />
              </div>
              <div class="flex flex-col space-y-2">
                <label class="font-semibold">Suffix :</label>
                <input
                  v-model="form.suffix"
                  type="text"
                  class="px-3 py-2 border w-[300px] border-gray-300 rounded-md text-gray-700"
                  placeholder="Enter suffix ..."
                />
              </div>
            </div>

            <!-- Second Row -->
            <div class="flex flex-row gap-3">
              <div class="flex flex-col space-y-2">
                <label class="font-semibold">Date of Birth :</label>
                <input
                  v-model="form.birthdate"
                  type="date"
                  class="px-3 py-2 border w-[300px] border-gray-300 rounded-md text-gray-700"
                />
              </div>
              <div class="flex flex-col space-y-2">
                <label class="font-semibold">Place of Birth :</label>
                <input
                  v-model="form.place_of_birth"
                  type="text"
                  class="px-3 py-2 border w-[300px] border-gray-300 rounded-md text-gray-700"
                  placeholder="Enter place of birth ..."
                />
              </div>
              <div class="flex flex-col space-y-2">
                <label class="font-semibold">Gender :</label>
                <select
                  v-model="form.gender"
                  class="px-3 py-2 border w-[300px] border-gray-300 rounded-md text-gray-700"
                >
                  <option disable value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div class="flex flex-col space-y-2">
                <label class="font-semibold">Civil Status :</label>
                <select
                  v-model="form.civil_status"
                  class="px-3 py-2 border w-[300px] border-gray-300 rounded-md text-gray-700"
                >
                  <option disabled value="">Select</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Widowed">Widowed</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Separated">Separated</option>
                  <option value="Annulled">Annulled</option>
                  <option value="Domestic Partnership">
                    Domestic Partnership
                  </option>
                </select>
              </div>
            </div>
          </div>

          <!-- Bottom Content -->
          <div class="flex justify-between w-full space-x-3">
            <div class="text-gray-700 space-y-4 border p-3 rounded-md w-full">
              <div class="flex flex-col space-y-2">
                <label class="font-semibold">Blood Type:</label>
                <select
                  v-model="form.blood_type"
                  class="px-3 py-2 border w-full border-gray-300 rounded-md text-gray-700"
                >
                  <option disabled value="">Select</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              <div class="flex gap-x-4">
                <div class="flex flex-col space-y-2 w-full">
                  <label class="font-semibold">Height (m):</label>
                  <input
                    v-model="form.height"
                    type="text"
                    class="px-3 py-2 border w-[300px] border-gray-300 rounded-md text-gray-700"
                    placeholder="Enter height in m ..."
                  />
                </div>
                <div class="flex flex-col space-y-2 w-full">
                  <label class="font-semibold">Weight (kg):</label>
                  <input
                    v-model="form.weight"
                    type="text"
                    class="px-3 py-2 border w-[300px] border-gray-300 rounded-md text-gray-700"
                    placeholder="Enter weight in kg ..."
                  />
                </div>
              </div>
              <div class="flex gap-x-4">
                <div class="flex flex-col space-y-2 w-full">
                  <label class="font-semibold">Is Dual Citizenship:</label>
                  <select
                    v-model="form.is_dual_citizen"
                    class="px-3 py-2 border w-full border-gray-300 rounded-md text-gray-700"
                  >
                    <option disabled value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
                <div class="flex flex-col space-y-2 w-full">
                  <label class="font-semibold">Citizenship :</label>
                  <input
                    v-model="form.citizenship"
                    type="text"
                    class="px-3 py-2 border w-[300px] border-gray-300 rounded-md text-gray-700"
                    placeholder="Enter citizenship ..."
                  />
                </div>
              </div>
              <div class="flex gap-x-4">
                <div class="flex flex-col space-y-2 w-full">
                  <label class="font-semibold">Employment Id:</label>
                  <input
                    v-model="form.employee_id"
                    type="text"
                    class="px-3 py-3 border w-[300px] border-gray-300 rounded-md text-gray-700"
                    placeholder="Enter employee id ..."
                  />
                </div>
                <div class="flex flex-col space-y-2 w-full">
                  <label class="font-semibold">Employment Status:</label>
                  <select
                    v-model="form.employment_status"
                    class="px-3 py-3 border w-full border-gray-300 rounded-md text-gray-700"
                  >
                    <option disabled value="">Select Status</option>
                    <option value="Active">Active</option>
                    <option value="InActive">InActive</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="text-gray-700 space-y-4 border p-3 rounded-md w-full">
              <div class="flex gap-2 w-full">
                <div class="flex flex-col space-y-2 flex-1">
                  <label class="font-semibold">GSIS ID Number :</label>
                  <input
                    v-model="form.gsis_id"
                    type="text"
                    class="px-3 py-2 border w-full border-gray-300 rounded-md text-gray-700"
                    placeholder="Enter GSIS ID number ..."
                  />
                </div>
                <div class="flex flex-col space-y-2 flex-1">
                  <label class="font-semibold">PAG-IBIG ID Number :</label>
                  <input
                    v-model="form.pagibig_id"
                    type="text"
                    class="px-3 py-2 border w-full border-gray-300 rounded-md text-gray-700"
                    placeholder="Enter PAG-IBIG ID number ..."
                  />
                </div>
              </div>
              <div class="flex gap-2 w-full">
                <div class="flex flex-col space-y-2 flex-1">
                  <label class="font-semibold">Philhealth :</label>
                  <input
                    v-model="form.philhealth"
                    type="text"
                    class="px-3 py-2 border w-full border-gray-300 rounded-md text-gray-700"
                    placeholder="Enter Philhealth number ..."
                  />
                </div>
                <div class="flex flex-col space-y-2 flex-1">
                  <label class="font-semibold">SSS Number :</label>
                  <input
                    v-model="form.sss_number"
                    type="text"
                    class="px-3 py-2 border w-full border-gray-300 rounded-md text-gray-700"
                    placeholder="Enter SSS number ..."
                  />
                </div>
              </div>
              <div class="flex gap-2 w-full">
                <div class="flex flex-col space-y-2 flex-1">
                  <label class="font-semibold">TIN Number :</label>
                  <input
                    v-model="form.tin_number"
                    type="text"
                    class="px-3 py-2 border w-full border-gray-300 rounded-md text-gray-700"
                    placeholder="Enter TIN number ..."
                  />
                </div>
                <div class="flex flex-col space-y-2 flex-1">
                  <label class="font-semibold">Telephone Number :</label>
                  <input
                    v-model="form.telephone_number"
                    type="text"
                    class="px-3 py-2 border w-full border-gray-300 rounded-md text-gray-700"
                    placeholder="Enter telephone number ..."
                  />
                </div>
              </div>
              <div class="flex gap-2 w-full">
                <div class="flex flex-col space-y-2 flex-1">
                  <label class="font-semibold">Mobile Number :</label>
                  <input
                    v-model="form.mobile_number"
                    type="text"
                    class="px-3 py-2 border w-full border-gray-300 rounded-md text-gray-700"
                    placeholder="Enter mobile number ..."
                  />
                </div>
                <div class="flex flex-col space-y-2 flex-1">
                  <label class="font-semibold">Agency :</label>
                  <input
                    v-model="form.agency"
                    type="text"
                    class="px-3 py-2 border w-full border-gray-300 rounded-md text-gray-700"
                    placeholder="Enter agency ..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Address Content -->
        <div
          v-if="activeSection === 'address'"
          class="overflow-y-auto max-h-[700px] pl-5 pr-5 space-y-3 text-left"
        >
          <h1 class="font-bold">Residential Address</h1>
          <div class="text-gray-700 space-y-4 border rounded-md p-2">
            <!-- First Row -->
            <div class="flex flex-row gap-3">
              <div class="flex flex-col space-y-2">
                <label class="font-semibold">House Number :</label>
                <input
                  v-model="form.house_number"
                  type="text"
                  class="px-3 py-2 border w-[300px] border-gray-300 rounded-md text-gray-700"
                  placeholder="Enter house number..."
                />
              </div>
              <div class="flex flex-col space-y-2">
                <label class="font-semibold">Street :</label>
                <input
                  v-model="form.street"
                  type="text"
                  class="px-3 py-2 border w-[300px] border-gray-300 rounded-md text-gray-700"
                  placeholder="Enter street ..."
                />
              </div>
              <div class="flex flex-col space-y-2">
                <label class="font-semibold">Subdivision/Village :</label>
                <input
                  v-model="form.subdivision"
                  type="text"
                  class="px-3 py-2 border w-[300px] border-gray-300 rounded-md text-gray-700"
                  placeholder="Enter subdivision ..."
                />
              </div>
              <div class="flex flex-col space-y-2">
                <label class="font-semibold">Barangay :</label>
                <input
                  v-model="form.barangay"
                  type="text"
                  class="px-3 py-2 border w-[300px] border-gray-300 rounded-md text-gray-700"
                  placeholder="Enter barangay ..."
                />
              </div>
            </div>

            <!-- Second Row -->
            <div class="flex flex-row gap-3">
              <div class="flex flex-col space-y-2">
                <label class="font-semibold">Municipality :</label>
                <input
                  v-model="form.municipality"
                  type="text"
                  class="px-3 py-2 border w-[300px] border-gray-300 rounded-md text-gray-700"
                  placeholder="Enter municipality ..."
                />
              </div>
              <div class="flex flex-col space-y-2">
                <label class="font-semibold">Province :</label>
                <input
                  v-model="form.province"
                  type="text"
                  class="px-3 py-2 border w-[300px] border-gray-300 rounded-md text-gray-700"
                  placeholder="Enter province ..."
                />
              </div>
              <div class="flex flex-col space-y-2">
                <label class="font-semibold">Zip Code :</label>
                <input
                  v-model="form.zip_code"
                  type="text"
                  class="px-3 py-2 border w-[300px] border-gray-300 rounded-md text-gray-700"
                  placeholder="Enter zip code ..."
                />
              </div>
            </div>
          </div>
          <div class="flex justify-between w-full">
            <h1 class="font-bold">Permanent Address</h1>
            <div class="flex gap-2">
              <p>Same Address</p>
              <input
                type="checkbox"
                v-model="sameAddress"
                @change="handleSameAddress"
              />
            </div>
          </div>

          <div class="text-gray-700 space-y-4 border rounded-md p-2">
            <!-- First Row -->
            <div class="flex flex-row gap-3">
              <div class="flex flex-col space-y-2">
                <label class="font-semibold">House Number :</label>
                <input
                  v-model="form.same_house_number"
                  type="text"
                  class="px-3 py-2 border w-[300px] border-gray-300 rounded-md text-gray-700"
                  placeholder="Enter house number..."
                />
              </div>
              <div class="flex flex-col space-y-2">
                <label class="font-semibold">Street :</label>
                <input
                  v-model="form.same_street"
                  type="text"
                  class="px-3 py-2 border w-[300px] border-gray-300 rounded-md text-gray-700"
                  placeholder="Enter street ..."
                />
              </div>
              <div class="flex flex-col space-y-2">
                <label class="font-semibold">Subdivision/Village :</label>
                <input
                  v-model="form.same_subdivision"
                  type="text"
                  class="px-3 py-2 border w-[300px] border-gray-300 rounded-md text-gray-700"
                  placeholder="Enter subdivision ..."
                />
              </div>
              <div class="flex flex-col space-y-2">
                <label class="font-semibold">Barangay :</label>
                <input
                  v-model="form.same_barangay"
                  type="text"
                  class="px-3 py-2 border w-[300px] border-gray-300 rounded-md text-gray-700"
                  placeholder="Enter barangay ..."
                />
              </div>
            </div>

            <!-- Second Row -->
            <div class="flex flex-row gap-3">
              <div class="flex flex-col space-y-2">
                <label class="font-semibold">Municipality :</label>
                <input
                  v-model="form.same_municipality"
                  type="text"
                  class="px-3 py-2 border w-[300px] border-gray-300 rounded-md text-gray-700"
                  placeholder="Enter municipality ..."
                />
              </div>
              <div class="flex flex-col space-y-2">
                <label class="font-semibold">Province :</label>
                <input
                  v-model="form.same_province"
                  type="text"
                  class="px-3 py-2 border w-[300px] border-gray-300 rounded-md text-gray-700"
                  placeholder="Enter province..."
                />
              </div>
              <div class="flex flex-col space-y-2">
                <label class="font-semibold">Zip Code :</label>
                <input
                  v-model="form.same_zip_code"
                  type="text"
                  class="px-3 py-2 border w-[300px] border-gray-300 rounded-md text-gray-700"
                  placeholder="Enter zip code ..."
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Education Background  -->
        <div
          v-if="activeSection === 'education'"
          class="overflow-y-auto max-h-[700px] pl-5 pr-5 space-y-3 text-center"
        >
          <div
            class="text-gray-900 witespace-y-4 border w-[1300px] rounded-md p-2"
          >
            <div class="overflow-x-auto mt-5 rounded-t-xl">
              <table class="min-w-full text-[13px] border border-gray-300">
                <thead class="bg-blue-500 text-white">
                  <tr>
                    <th class="border px-2 py-2" rowspan="2">
                      EDUCATIONAL LEVEL
                    </th>
                    <th class="border px-2 py-2" rowspan="2">
                      NAME OF SCHOOL (Write in full)
                    </th>
                    <th class="border px-2 py-2" rowspan="2">
                      BASIC EDUCATION/DEGREE/COURSE
                    </th>
                    <th class="border px-2 py-2" colspan="2">PERIOD</th>
                    <th class="border px-2 py-2" rowspan="2">
                      HIGHEST LEVEL/UNIT HEADS (If not graduated)
                    </th>
                    <th class="border px-2 py-2" rowspan="2">YEAR GRADUATED</th>
                    <th class="border px-2 py-2" rowspan="2">
                      SCHOLARSHIP/ACADEMIC scholarship RECEIVED
                    </th>
                    <th class="border px-2 py-2" rowspan="2">Action</th>
                  </tr>
                  <tr>
                    <th class="border px-3 py-2">FROM</th>
                    <th class="border px-3 py-2">TO</th>
                  </tr>
                </thead>

                <tbody>
                  <tr
                    v-for="(record, index) in form.educationalRecords"
                    :key="index"
                  >
                    <td class="border px-2 py-3">
                      <input
                        type="text"
                        v-model="record.level"
                        class="w-full text-sm rounded"
                      />
                    </td>
                    <td class="border px-2 py-2">
                      <input
                        type="text"
                        v-model="record.name_of_school"
                        class="w-full text-sm rounded"
                      />
                    </td>
                    <td class="border px-2 py-2">
                      <input
                        type="text"
                        v-model="record.basic_education"
                        class="w-full text-sm rounded"
                      />
                    </td>
                    <td class="border px-2 py-2">
                      <input
                        type="text"
                        v-model="record.educ_from"
                        class="w-full text-sm rounded"
                        placeholder="FROM"
                      />
                    </td>
                    <td class="border px-2 py-2">
                      <input
                        type="text"
                        v-model="record.educ_to"
                        class="w-full text-sm rounded"
                        placeholder="TO"
                      />
                    </td>
                    <td class="border px-2 py-2">
                      <input
                        type="text"
                        v-model="record.highest_level"
                        class="w-full text-sm rounded"
                      />
                    </td>
                    <td class="border px-2 py-2">
                      <input
                        type="text"
                        v-model="record.year_graduated"
                        class="w-full text-sm rounded"
                      />
                    </td>
                    <td class="border px-2 py-2">
                      <input
                        type="text"
                        v-model="record.scholarship"
                        class="w-full text-sm rounded"
                      />
                    </td>
                    <td class="border px-2 py-2">
                      <button
                        @click="removeRow(index, 'level')"
                        class="text-red-500 text-sm"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <button
                class="mt-2 bg-green-500 hover:bg-green-400 text-white text-sm px-3 py-2 rounded"
                @click="addRowEducation"
              >
                Add Education
              </button>
            </div>
          </div>
        </div>

        <!-- Civil Service  -->
        <div
          v-if="activeSection === 'civil'"
          class="overflow-y-auto max-h-[700px] pl-5 pr-5 space-y-3 text-center"
        >
          <div
            class="text-gray-900 witespace-y-4 border w-[1300px] rounded-md p-2"
          >
            <div class="overflow-x-auto mt-5 rounded-t-xl">
              <table
                class="min-w-full text-[13px] border border-gray-300 rounded-t-xl"
              >
                <thead class="bg-blue-500 text-white">
                  <tr>
                    <th class="border px-2 py-2" rowspan="2">
                      CARREER SERVICE/ RA 1080 (BOARD/BAR) UNDER SPECIAL LAWS/
                      CES/ CSEE/ BARANGAY ELIGIBILITY/ DRIVERS LISCENNSE
                    </th>
                    <th class="border px-2 py-2" rowspan="2">
                      RATING (If Applicable)
                    </th>

                    <th class="border px-2 py-2" rowspan="2">
                      DATE OF EXAMINATION/ CONFERMENT
                    </th>
                    <th class="border px-2 py-2" rowspan="2">
                      PLACE OF EXAMINATION / CONDERMENT
                    </th>
                    <th class="border px-2 py-2" colspan="2">
                      LISCENSE (If applicable)
                    </th>
                    <th class="border px-2 py-2" rowspan="2">Action</th>
                  </tr>
                  <tr>
                    <th class="border px-3 py-2">Number</th>
                    <th class="border px-3 py-2">Date of Validity</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="(record, index) in form.civilRecords" :key="index">
                    <td class="border px-2 py-3">
                      <input
                        type="text"
                        v-model="record.career_service"
                        class="w-full text-sm rounded"
                      />
                    </td>
                    <td class="border px-2 py-2">
                      <input
                        type="text"
                        v-model="record.rating"
                        class="w-full text-sm rounded"
                      />
                    </td>

                    <td class="border px-2 py-2">
                      <input
                        type="text"
                        v-model="record.date_of_exam"
                        class="w-full text-sm rounded"
                      />
                    </td>
                    <td class="border px-2 py-2">
                      <input
                        type="text"
                        v-model="record.place_of_exam"
                        class="w-full text-sm rounded"
                      />
                    </td>
                    <td class="border px-2 py-2">
                      <input
                        type="text"
                        v-model="record.license_number"
                        class="w-full text-sm rounded"
                      />
                    </td>
                    <td class="border px-2 py-2">
                      <input
                        type="text"
                        v-model="record.license_validity"
                        class="w-full text-sm rounded"
                      />
                    </td>
                    <td class="border px-2 py-2">
                      <button
                        @click="removeRow(index, 'civil')"
                        class="text-red-500 text-sm"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <button
                class="mt-2 bg-green-500 hover:bg-green-400 text-white text-sm px-3 py-2 rounded"
                @click="addRowCivil"
              >
                Add Civil Service
              </button>
            </div>
          </div>
        </div>

        <!-- Learning and Development  -->
        <div
          v-if="activeSection === 'learning'"
          class="overflow-y-auto max-h-[700px] pl-5 pr-5 space-y-3 text-center"
        >
          <div
            class="text-gray-900 witespace-y-4 border w-[1300px] rounded-md p-2"
          >
            <div class="overflow-x-auto mt-5 rounded-t-xl">
              <table class="min-w-full text-[13px] border border-gray-300">
                <thead class="bg-blue-500 text-white">
                  <tr>
                    <th class="border px-2 py-2" rowspan="2">
                      TITLE OF LEARNING AND DEVELOPMENT INTERVENTIONS PROGRAMS
                      (Write in full)
                    </th>
                    <th class="border px-2 py-2" colspan="2">
                      INCLUSIVE DATES OF ATTENDANCE (mm/dd/yyyy)
                    </th>
                    <th class="border px-2 py-2" rowspan="2">
                      NUMBER OF HOURS
                    </th>

                    <th class="border px-2 py-2" rowspan="2">
                      Type of LD (Mangerial/Supervisory/Technical/etc)
                    </th>
                    <th class="border px-2 py-2" rowspan="2">
                      CONDUCTED SPONSORED BY (Write in full)
                    </th>

                    <th class="border px-2 py-2" rowspan="2">Action</th>
                  </tr>
                  <tr>
                    <th class="border px-3 py-2">FROM</th>
                    <th class="border px-3 py-2">TO</th>
                  </tr>
                </thead>

                <tbody>
                  <tr
                    v-for="(record, index) in form.learningRecords"
                    :key="index"
                  >
                    <td class="border px-2 py-3">
                      <input
                        type="text"
                        v-model="record.title_learning_development"
                        class="w-full text-sm rounded"
                      />
                    </td>
                    <td class="border px-2 py-3">
                      <input
                        type="text"
                        v-model="record.ld_from"
                        class="w-full text-sm rounded"
                        placeholder="From"
                      />
                    </td>
                    <td class="border px-2 py-3">
                      <input
                        type="texts"
                        v-model="record.ld_to"
                        class="w-full text-sm rounded"
                        placeholder="To"
                      />
                    </td>
                    <td class="border px-2 py-3">
                      <input
                        type="text"
                        v-model="record.ld_number_of_hours"
                        class="w-full text-sm rounded"
                      />
                    </td>
                    <td class="border px-2 py-3">
                      <input
                        type="text"
                        v-model="record.type_of_ld"
                        class="w-full text-sm rounded"
                        placeholder="e.g. Managerial"
                      />
                    </td>
                    <td class="border px-2 py-3">
                      <input
                        type="text"
                        v-model="record.ld_conducted_sponsor"
                        class="w-full text-sm rounded"
                        placeholder="Conducted by"
                      />
                    </td>
                    <td class="border px-2 py-3">
                      <button
                        @click="removeRow(index, 'title_learning_development')"
                        class="text-red-500 text-sm"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <button
                class="mt-2 bg-green-500 hover:bg-green-400 text-white text-sm px-3 py-2 rounded"
                @click="addRowLearning"
              >
                Add Learning and Development
              </button>
            </div>
          </div>
        </div>

        <!-- Others Information  -->
        <div
          v-if="activeSection === 'others'"
          class="overflow-y-auto max-h-[700px] pl-5 pr-5 space-y-3 text-center"
        >
          <!-- Special Skills and Hobbies Table -->
          <div
            class="text-gray-900 witespace-y-4 border w-[1300px] rounded-md p-2"
          >
            <div class="overflow-x-auto mt-5 rounded-t-xl">
              <table class="min-w-full text-[13px] border border-gray-300">
                <thead class="bg-blue-500 text-white">
                  <tr>
                    <th class="border px-2 py-2" rowspan="2">
                      SPECIAL SKILLS and HOBBIES
                    </th>
                    <th class="border px-2 py-2" rowspan="2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(record, index) in form.specialSkillsRecords"
                    :key="index"
                  >
                    <td class="border px-2 py-3">
                      <input
                        type="text"
                        v-model="record.special_skills"
                        class="w-full text-sm rounded"
                      />
                    </td>
                    <td class="border px-2 py-3">
                      <button
                        @click="removeRow(index, 'special_skills')"
                        class="text-red-500 text-sm"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <button
                class="mt-2 bg-green-500 hover:bg-green-400 text-white text-sm px-3 py-2 rounded"
                @click="addRowSpecial"
              >
                Add Special Skills
              </button>
            </div>
          </div>

          <!-- Non-Academic Distinction Table -->
          <div
            class="text-gray-900 witespace-y-4 border w-[1300px] rounded-md p-2"
          >
            <div class="overflow-x-auto mt-5 rounded-t-xl">
              <table class="min-w-full text-[13px] border border-gray-300">
                <thead class="bg-blue-500 text-white">
                  <tr>
                    <th class="border px-2 py-2" rowspan="2">
                      NON-ACADEMIC DISTINCTION / RECOGNITION (Write in full)
                    </th>
                    <th class="border px-2 py-2" rowspan="2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(record, index) in form.nonAcadRecords"
                    :key="index"
                  >
                    <td class="border px-2 py-3">
                      <input
                        type="text"
                        v-model="record.non_academic"
                        class="w-full text-sm rounded"
                      />
                    </td>
                    <td class="border px-2 py-3">
                      <button
                        @click="removeRow(index, 'non_academic')"
                        class="text-red-500 text-sm"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <button
                class="mt-2 bg-green-500 hover:bg-green-400 text-white text-sm px-3 py-2 rounded"
                @click="addRowNonAcad"
              >
                Add Non-Academic
              </button>
            </div>
          </div>

          <!-- Membership in Association  -->
          <div
            class="text-gray-900 witespace-y-4 border w-[1300px] rounded-md p-2"
          >
            <div class="overflow-x-auto mt-5 rounded-t-xl">
              <table class="min-w-full text-[13px] border border-gray-300">
                <thead class="bg-blue-500 text-white">
                  <tr>
                    <th class="border px-2 py-2" rowspan="2">
                      MEMBERSHIP IN ASSOCIAITON/ORGANIZATION (Write in full)
                    </th>
                    <th class="border px-2 py-2" rowspan="2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(record, index) in form.membershipRecords"
                    :key="index"
                  >
                    <td class="border px-2 py-3">
                      <input
                        type="text"
                        v-model="record.membership"
                        class="w-full text-sm rounded"
                      />
                    </td>
                    <td class="border px-2 py-3">
                      <button
                        @click="removeRow(index, 'membership')"
                        class="text-red-500 text-sm"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <button
                class="mt-2 bg-green-500 hover:bg-green-400 text-white text-sm px-3 py-2 rounded"
                @click="addRowMembership"
              >
                Add Memeber
              </button>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex place-items-end justify-end gap-2 p-5">
          <button
            @click="closeAdd"
            class="bg-red-500 hover:bg-red-300 px-5 py-2 rounded-md text-white hover:text-red-700"
          >
            Cancel
          </button>

          <button
            @click="submitData"
            class="bg-green-700 hover:bg-green-300 px-5 py-2 rounded-md text-white hover:text-green-700"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Validation Modal -->
  <div
    v-if="showValidationModal"
    class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
  >
    <div
      class="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden border border-red-400"
    >
      <div
        class="flex justify-between items-center bg-red-100 px-6 py-4 border-b border-red-300"
      >
        <h2 class="text-xl font-bold text-red-700">Validation Errors</h2>
        <icon
          :name="'circle-close3'"
          @click="closeValidationModal"
          class="cursor-pointer text-red-700 hover:text-red-900 transition"
          title="Close"
          aria-label="Close validation errors modal"
        />
      </div>

      <div class="px-6 py-5 space-y-4">
        <p class="text-sm text-gray-600 italic text-left">
          Please correct the following errors before submitting the form.
          <br />
          <span class="font-semibold text-red-600">Note:</span> If a field does
          not apply, enter
          <span class="font-monotext-gray-900 px-1 rounded font-bold">N/A</span
          >.
        </p>

        <ul
          class="list-disc list-inside text-left max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-red-300 scrollbar-track-red-50"
        >
          <li
            v-for="error in validationErrors"
            :key="error"
            class="text-red-700 text-sm leading-relaxed"
          >
            {{ error }}
          </li>
        </ul>
      </div>

      <div class="px-6 py-4 bg-red-50 flex justify-end border-t border-red-300">
        <button
          @click="closeValidationModal"
          class="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md px-4 py-2 transition"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import icon from "@/assets/icon.vue";
import axios from "axios";
import { toast } from "vue3-toastify";

export default {
  name: "EditEmployeeProfile",
  components: {
    icon,
  },
  props: {
    employeeId: {
      type: [Number, String],
      required: true,
    },
  },
  data() {
    return {
      isOpen: true,
      activeSection: "personal",
      sameAddress: false,
      form: {
        first_name: "",
        middle_name: "",
        last_name: "",
        suffix: "",
        birthdate: "",
        place_of_birth: "",
        gender: "",
        civil_status: "",
        blood_type: "",
        height: "",
        weight: "",
        is_dual_citizen: false,
        citizenship: "",
        gsis_id: "",
        pagibig_id: "",
        philhealth: "",
        sss_number: "",
        tin_number: "",
        telephone_number: "",
        mobile_number: "",
        agency: "",
        educationalRecords: [],
        civilRecords: [],
        learningRecords: [],
        otherRecords: [],
        specialSkillsRecords: [],
        nonAcadRecords: [],
        membershipRecords: [],
        house_number: "",
        street: "",
        subdivision: "",
        barangay: "",
        municipality: "",
        province: "",
        zip_code: "",
        same_house_number: "",
        same_street: "",
        same_subdivision: "",
        same_barangay: "",
        same_municipality: "",
        same_province: "",
        same_zip_code: "",
        employment_status: "",
        employee_id: "",
      },
      user: {},
    };
  },
  methods: {
    closeAdd() {
      this.isOpen = false;
      this.$emit("close");
    },
    toggleSection(section) {
      this.activeSection = section;
    },
    formatBirthdate(dateStr) {
      if (!dateStr || typeof dateStr !== "string") return "N/A";
      const parts = dateStr.split("/"); // ["11", "15", "1991"]
      if (parts.length !== 3) return dateStr; // fallback if unexpected format
      const [month, day, year] = parts;
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    },

    async submitData() {
      const formData = { ...this.form };

      // Replace empty strings with undefined (so backend ignores them)
      Object.keys(formData).forEach((key) => {
        if (
          formData[key] === "" &&
          typeof formData[key] !== "boolean" &&
          !Array.isArray(formData[key])
        ) {
          formData[key] = undefined;
        }
      });

      // Format birthdate
      formData.birthdate = this.formatBirthdate(this.form.birthdate);

      console.log(
        "🟦 UPDATE PAYLOAD SENT TO BACKEND:",
        JSON.parse(JSON.stringify(formData))
      );

      try {
        const response = await axios.patch(
          process.env.VUE_APP_API_BASE_URL + `/upload/${this.employeeId}`,
          formData
        );

        console.log("🟩 BACKEND RESPONSE:", response.data);
        toast.success("Employee updated successfully!");
        this.$emit("refresh");

        if (response.status === 200) {
          this.resetForm();
          this.closeAdd();
        }

        this.isOpen = false;
      } catch (error) {
        console.error(
          "❌ Error during form submission:",
          error.response || error
        );
        if (error.response?.data?.message) {
          alert("Server Error: " + error.response.data.message);
        } else {
          alert("There was an error submitting the form.");
        }
      }
    },

    resetForm() {
      Object.keys(this.form).forEach((key) => {
        if (Array.isArray(this.form[key])) {
          this.form[key] = [];
        } else if (typeof this.form[key] === "boolean") {
          this.form[key] = false;
        } else {
          this.form[key] = "";
        }
      });
    },

    removeRow(index, type) {
      if (type === "level") this.form.educationalRecords.splice(index, 1);
      else if (type === "civil") this.form.civilRecords.splice(index, 1);
      else if (type === "title_learning_development")
        this.form.learningRecords.splice(index, 1);
      else if (type === "others") this.form.otherRecords.splice(index, 1);
      else if (type === "special_skills")
        this.form.specialSkillsRecords.splice(index, 1);
      else if (type === "non_academic")
        this.form.nonAcadRecords.splice(index, 1);
      else if (type === "membership")
        this.form.membershipRecords.splice(index, 1);
    },

    addRowEducation() {
      this.form.educationalRecords.push({
        level: "",
        name_of_school: "",
        basic_education: "",
        educ_from: "",
        educ_to: "",
        highest_level: "",
        year_graduated: "",
        scholarship: "",
      });
    },
    addRowCivil() {
      this.form.civilRecords.push({
        career_service: "",
        rating: "",
        date_of_exam: "",
        place_of_exam: "",
        license_number: "",
        license_validity: "",
      });
    },
    addRowLearning() {
      this.form.learningRecords.push({
        title_learning_development: "",
        ld_from: "",
        ld_to: "",
        ld_number_of_hours: "",
        type_of_ld: "",
        ld_conducted_sponsor: "",
      });
    },
    addRowSpecial() {
      this.form.specialSkillsRecords.push({ special_skills: "" });
    },
    addRowNonAcad() {
      this.form.nonAcadRecords.push({ non_academic: "" });
    },
    addRowMembership() {
      this.form.membershipRecords.push({ membership: "" });
    },

    handleSameAddress() {
      if (this.sameAddress) {
        this.form.same_house_number = this.form.house_number;
        this.form.same_street = this.form.street;
        this.form.same_subdivision = this.form.subdivision;
        this.form.same_barangay = this.form.barangay;
        this.form.same_municipality = this.form.municipality;
        this.form.same_province = this.form.province;
        this.form.same_zip_code = this.form.zip_code;
      } else {
        this.form.same_house_number = "";
        this.form.same_street = "";
        this.form.same_subdivision = "";
        this.form.same_barangay = "";
        this.form.same_municipality = "";
        this.form.same_province = "";
        this.form.same_zip_code = "";
      }
    },

    async fetchEmployeeRecords() {
      try {
        const response = await axios.get(
          process.env.VUE_APP_API_BASE_URL + `/upload/${this.employeeId}`
        );
        if (response.data) {
          this.form = {
            ...this.form,
            ...response.data,
            educationalRecords: response.data.secondTable || [],
            civilRecords: response.data.forthTable || [],
            learningRecords: response.data.fifthTable || [],
            specialSkillsRecords: response.data.thirdTable || [],
            nonAcadRecords: response.data.sixthTable || [],
            membershipRecords: response.data.seventhTable || [],
          };
          console.log("FORM DATA", this.form);
        }
      } catch (error) {
        console.error("Error fetching employee records:", error);
      }
    },
  },
  mounted() {
    this.fetchEmployeeRecords();
  },
};
</script>

<style scoped>
table input {
  outline: none;
}
</style>
