#include <iostream>
#include <vector>
using namespace std;

int main() {
    int k;
    cin >> k;
    vector<long long> pieces(k);
    for (int i = 0; i < k; i++) {
        cin >> pieces[i];
    }
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        long long s;
        cin >> s;
        long long nb = 0;
        for (int j = k - 1; j >= 0; j--) {   // de la plus grande à la plus petite
            nb += s / pieces[j];
            s = s % pieces[j];
        }
        cout << nb << "\n";
    }
    return 0;
}
