#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<long long> a(n);
    for (int i = 0; i < n; i++) {
        cin >> a[i];
    }
    sort(a.begin(), a.end());

    long long total = 0;
    for (int k = 2; k < n; k++) {      // a[k] est le plus grand côté
        int i = 0, j = k - 1;
        while (i < j) {
            if (a[i] + a[j] > a[k]) {
                total += j - i;        // a[i..j-1] conviennent tous avec a[j]
                j--;
            } else {
                i++;                   // a[i] ne convient avec aucun élément restant
            }
        }
    }
    cout << total << "\n";
    return 0;
}
