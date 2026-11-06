#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> nombres(n);
    for (int i = 0; i < n; i++) {
        cin >> nombres[i];
    }
    // On parcourt les positions de n - 1 jusqu'à 0.
    for (int i = n - 1; i >= 0; i--) {
        cout << nombres[i] << " ";
    }
    cout << "\n";
    return 0;
}
