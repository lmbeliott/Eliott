#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<long long> b(n);
    for (int i = 0; i < n; i++) {
        cin >> b[i];
    }
    sort(b.begin(), b.end());
    long long total = 0;
    long long deja = 0;          // somme des valeurs b[0], ..., b[j-1]
    for (int j = 0; j < n; j++) {
        // paires (i, j) avec i < j : écart b[j] - b[i]
        total += j * b[j] - deja;
        deja += b[j];
    }
    cout << total << "\n";
    return 0;
}
