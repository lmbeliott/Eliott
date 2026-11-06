#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> alt(n);
    for (int i = 0; i < n; i++) {
        cin >> alt[i];
    }
    int total = 0;
    // On compare chaque point avec le précédent : i commence à 1.
    for (int i = 1; i < n; i++) {
        if (alt[i] > alt[i - 1]) {
            total = total + (alt[i] - alt[i - 1]);
        }
    }
    cout << total << "\n";
    return 0;
}
