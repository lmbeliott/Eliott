#include <iostream>
#include <string>
#include <vector>
using namespace std;

int main() {
    int n;
    string mot;
    cin >> n >> mot;

    vector<long long> vus(26, 0);   // apparitions de chaque lettre avant la position courante
    long long total = 0;
    for (char c : mot) {
        int r = c - 'a';
        total = total + vus[r];   // un couple avec chaque apparition précédente
        vus[r] = vus[r] + 1;
    }
    cout << total << "\n";
    return 0;
}
